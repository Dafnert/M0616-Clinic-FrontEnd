// src/app/crear-paciente/crear-paciente.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
  dniErrors: { valid: boolean; hasLetters: boolean; hasNumbers: boolean; hasEightDigits: boolean } = { valid: false, hasLetters: false, hasNumbers: false, hasEightDigits: false };
  passwordErrors: { hasNumber: boolean; hasUppercase: boolean } = { hasNumber: false, hasUppercase: false };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name:         ['', Validators.required],
      surname:      [''],
      age:          ['', [Validators.required, Validators.min(0)]],
      dni:          ['', [Validators.required, this.dniValidator.bind(this)]],
      username:     ['', Validators.required],
      password:     ['', [Validators.required, this.passwordValidator.bind(this)]],
      teneVih:      [false],
      disease:      [''],
      alergias:     [''],
      observations: [''],
      acceptedPrivacy: [false, Validators.requiredTrue],
      acceptedAnesthesia: [false],
    });

    // Escuchar cambios en DNI
    this.form.get('dni')?.valueChanges.subscribe((value) => {
      this.validateDniRequirements(value);
    });

    // Escuchar cambios en contraseña
    this.form.get('password')?.valueChanges.subscribe((value) => {
      this.validatePasswordRequirements(value);
    });
  }

  // Validador personalizado para DNI
  dniValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return this.validateDniRequirements(control.value) ? null : { dniInvalid: true };
  }

  // Validador personalizado para contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hasNumber = /[0-9]/.test(control.value);
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasNumber && hasUppercase ? null : { passwordInvalid: true };
  }

  validateDniRequirements(dni: string): boolean {
    const hasEightDigits = /^[0-9]{8}/.test(dni);
    const hasLetters = /[a-zA-Z]/.test(dni);
    const hasNumbers = /[0-9]/.test(dni);
    const isValid = hasEightDigits && hasLetters;

    this.dniErrors = {
      valid: isValid,
      hasEightDigits,
      hasNumbers,
      hasLetters
    };
    return isValid;
  }

  validatePasswordRequirements(password: string): void {
    this.passwordErrors = {
      hasNumber: /[0-9]/.test(password),
      hasUppercase: /[A-Z]/.test(password)
    };
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
      acceptedPrivacy: v.acceptedPrivacy,
      acceptedAnesthesia: v.acceptedAnesthesia,
    };
    if (v.surname)  body['surname']  = v.surname;
    if (v.alergias) body['alergias'] = v.alergias;
    console.log(body);
    this.http.post('http://localhost:8000/patient', body).subscribe({
      next: () => this.router.navigate(['/patients']),
      error: (err) => {
        console.error('ERROR POST /patient:', err);
        if (err.status === 409) {
          this.error = 'El pacient ja està registrat a la base de dades';
        } else {
          this.error = err.error?.message || err.message || 'Error al crear el pacient';
        }
      }
    });
  }

  cancelar() {
    this.router.navigate(['/agenda']);
  }
}