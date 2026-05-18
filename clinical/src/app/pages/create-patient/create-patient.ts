// src/app/crear-paciente/crear-paciente.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-patient.html',
  styleUrls: ['./create-patient.css']
})
export class CrearPacienteComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name:     ['', Validators.required],
      age:      ['', [Validators.required, Validators.min(0)]],
      dni:      ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      disease:  [''],
      observations: ['']
    });
  }

  guardar() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8000/patient', this.form.value).subscribe({
      next: () => this.router.navigate(['/agenda']),
      error: (err) => this.error = err.error?.message || 'Error al crear el pacient'
    });
  }

  cancelar() {
    this.router.navigate(['/agenda']);
  }
}