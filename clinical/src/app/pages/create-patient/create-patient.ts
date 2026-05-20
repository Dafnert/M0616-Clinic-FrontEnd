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
      name:         ['', Validators.required],
      surname:      [''],
      age:          ['', [Validators.required, Validators.min(0)]],
      dni:          ['', Validators.required],
      username:     ['', Validators.required],
      password:     ['', Validators.required],
      teneVih:      [false],
      disease:      [''],
      alergias:     [''],
      observations: ['']
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const body: any = {
      name:     v.name,
      age:      parseInt(v.age, 10),
      dni:      v.dni,
      username: v.username,
      password: v.password,
      disease:  v.teneVih ? 'vih' : (v.disease || ''),
      observations: v.observations || '',
    };
    if (v.surname)  body['surname']  = v.surname;
    if (v.alergias) body['alergias'] = v.alergias;

    this.http.post('http://localhost:8000/patient', body).subscribe({
      next: () => this.router.navigate(['/patients']),
      error: (err) => {
        console.error('ERROR POST /patient:', err);
        this.error = err.error?.message || err.message || 'Error al crear el pacient';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/agenda']);
  }
}