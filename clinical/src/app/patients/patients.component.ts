import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';

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

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return q
      ? this.patients().filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.surname.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q)
        )
      : this.patients();
  });

  ngOnInit() {
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
