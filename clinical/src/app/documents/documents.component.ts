import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();
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
    this.uploading = true;

    this.documentService.upload(this.patientId, file).subscribe({
      next: (res) => {
        this.documents.push(res.data);
        this.uploading = false;
        input.value = '';
      },
      error: () => {
        this.error = 'Error al subir el archivo';
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