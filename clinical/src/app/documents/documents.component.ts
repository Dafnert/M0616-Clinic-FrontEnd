import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../services/document.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})

export class DocumentsComponent implements OnInit {
  @Input() patientId!: number;

  documents: any[] = [];
  isLoading = false;
  uploading = false;
  error = '';

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.patientId) {
      const idFromUrl = this.route.snapshot.paramMap.get('patientId');
      this.patientId = idFromUrl ? +idFromUrl : 0;
    }
    if (this.patientId) {
      this.loadDocuments();
    } else {
      this.error = 'No se ha especificado el paciente';
    }
  }

  loadDocuments() {
    this.isLoading = true;
    this.documentService.getByPatient(this.patientId).subscribe({
      next: (res) => {
        this.documents = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar documentos';
        this.isLoading = false;
      }
    });
  }

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  if (!this.patientId) {
    this.error = 'Paciente no definido para subir el archivo';
    return;
  }

  console.log('Subir archivo', {
    patientId: this.patientId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  this.uploading = true;
  this.error = '';

  this.documentService.upload(this.patientId, file).subscribe({
    next: (res: any) => {
      this.documents.push(res.data); // backend OK
      this.uploading = false;
      input.value = '';
    },
    error: (err) => {
      const backendMessage =
        err?.error?.message ||
        (typeof err?.error === 'string' ? err.error : undefined) ||
        err?.statusText ||
        err?.message ||
        'Error interno del servidor';
      console.error('Error al subir documento:', err);
      this.error = `Error al subir el archivo: ${backendMessage}`;
      this.uploading = false;
    }
  });
}

  download(id: number) {
    window.open(this.documentService.getDownloadUrl(id), '_blank');
  }

  delete(id: number) {
    if (!confirm('¿Eliminar este documento?')) return;
    this.documentService.delete(id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== id);
      },
      error: () => this.error = 'Error al eliminar'
    });
  }

  getIcon(mimeType: string): string {
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    return '📎';
  }
}