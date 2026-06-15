import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  patients = signal<Patient[]>([]);
  loading = signal(true);
  error = signal(false);
  search = signal('');
  confirmandoEliminar = signal<number | null>(null);
  deleteError = signal<string | null>(null);
  searchError = signal<string | null>(null);
  searchLoading = signal(false);
  currentPage = signal(1);

  private readonly itemsPerPage = 8;
  private searchSubject = new Subject<string>();

  filtered = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.patients().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() =>
    Math.ceil(this.patients().length / this.itemsPerPage)
  );

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit() {
    this.loadAll();

    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      this.currentPage.set(1);
      this.performSearch(query);
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(value: string) {
    this.search.set(value);
    this.searchSubject.next(value);
  }

  private loadAll() {
    this.patientService.getAll().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data.data ?? data.patients ?? []);
        this.patients.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private performSearch(query: string) {
    if (!query.trim()) {
      this.searchError.set(null);
      this.loadAll();
      return;
    }

    this.searchLoading.set(true);
    this.searchError.set(null);

    this.patientService.searchByName(query).subscribe({
      next: (res) => {
        this.patients.set(res.patients || []);
        this.searchLoading.set(false);
      },
      error: (err) => {
        this.searchLoading.set(false);
        if (err.status === 404) {
          this.patients.set([]);
        } else {
          this.searchError.set('Error en la cerca');
        }
      }
    });
  }

  verFicha(id: number) {
    this.router.navigate(['/ficha-paciente', id]);
  }

  nouPacient() {
    this.router.navigate(['/pacient/nou']);
  }

  pedirConfirmacion(id: number) {
    this.deleteError.set(null);
    this.confirmandoEliminar.set(id);
  }

  cancelarEliminar() {
    this.confirmandoEliminar.set(null);
    this.deleteError.set(null);
  }

  confirmarEliminar(id: number) {
    this.patientService.delete(id).subscribe({
      next: () => {
        this.patients.update(list => list.filter(p => p.id !== id));
        this.confirmandoEliminar.set(null);
        if (this.filtered().length === 0 && this.currentPage() > 1) {
          this.currentPage.update(p => p - 1);
        }
      },
      error: (err) => {
        this.deleteError.set(
          err.status === 500 || err.status === 409
            ? 'No es pot eliminar: el pacient té cites associades.'
            : 'Error en eliminar el pacient.'
        );
      }
    });
  }
}