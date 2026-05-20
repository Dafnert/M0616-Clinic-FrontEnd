import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PatientProfileComponent implements OnInit {

  @Input() patientId?: number;
  @Input() embedded = false;

  patient: Patient = new Patient();
  isLoading = true;
  loadError = false;

  isEditing = false;
  editForm: Partial<Patient> = {};
  editVih = false;
  showPasswordChange = false;
  newPassword = '';
  confirmPassword = '';
  passwordMismatch = false;
  saveSuccess = false;
  saveError = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const id = this.patientId ?? this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientService.getById(+id).subscribe({
        next: (res) => {
          this.patient = res.patient;
          this.isLoading = false;
        },
        error: () => {
          this.loadError = true;
          this.isLoading = false;
        }
      });
    }
  }

  getInitials(): string {
    if (!this.patient.name) return '';
    return [this.patient.name, this.patient.surname]
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  startEdit(): void {
    this.editForm = { ...this.patient };
    this.editVih = this.patient.disease?.toLowerCase() === 'vih';
    this.isEditing = true;
    this.saveSuccess = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.showPasswordChange = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordMismatch = false;
  }

  saveChanges(): void {
    if (this.showPasswordChange) {
      if (this.newPassword !== this.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      this.editForm.password = this.newPassword;
    }

    if (this.editVih) {
      this.editForm.disease = 'vih';
    }

    console.log('GUARDANDO paciente ID:', this.patient.id, 'Datos:', this.editForm);
    this.patientService.update(this.patient.id, this.editForm).subscribe({
      next: (res) => {
        console.log('RESPUESTA UPDATE:', res);
        this.patient = res.patient ?? { ...this.patient, ...this.editForm };
        this.isEditing = false;
        this.showPasswordChange = false;
        this.newPassword = '';
        this.confirmPassword = '';
        this.passwordMismatch = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: (err) => {
        console.error('ERROR UPDATE /patient/' + this.patient.id, err.status, err.error);
        this.saveError = true;
        setTimeout(() => this.saveError = false, 3000);
      }
    });
  }
}