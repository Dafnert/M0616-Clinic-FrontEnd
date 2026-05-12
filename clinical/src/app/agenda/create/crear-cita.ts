import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';
import { PatientService } from '../../services/patient.service';
import {Patient} from '../../models/patient';
@Component({
  selector: 'app-crear-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cita.html',
  styleUrls: ['./crear-cita.css']
})
export class CrearCitaComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  visitaId: number | null = null;
  titulo = 'Nova cita';
  visitaActual: any = null;
  patients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private agendaService: AgendaService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    // Cargar la lista de pacientes
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (err) => {
        console.log('ERROR AL CARGAR PACIENTES', err);
      }
    });

    // Inicializar formulario vacío
    this.form = this.fb.group({
      patientId: [''],
      date: [''],
      hourVisit: [''],
      reason: [''],
      observations: ['']
    });

    // Detectar si es modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.visitaId = params['id'];
        this.titulo = 'Actualitzar cita';
        this.cargarVisita(params['id']);
      } else {
        // Modo creación
        const fecha = this.route.snapshot.queryParamMap.get('fecha');
        this.form.patchValue({ date: fecha || '' });
      }
    });
  }

  cargarVisita(id: number) {
    this.agendaService.getVisitaById(id).subscribe({
      next: (visita) => {
        this.visitaActual = visita;
        this.form = this.fb.group({
          patientId: [visita.paciente?.id || ''],
          date: [visita.fecha],
          hourVisit: [visita.hora_inicio],
          reason: [visita.motivo_consulta],
          observations: [visita.paciente?.observations || '']
        });
      },
      error: (err) => {
        console.log('ERROR AL CARGAR VISITA', err);
        this.router.navigate(['/agenda']);
      }
    });
  }

  guardar() {
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const data = this.form.value;

    if (this.isEditMode && this.visitaId) {
      // Modo edición - actualizar
      this.agendaService.updateVisita(this.visitaId, {
        fecha: data.date,
        hora_inicio: data.hourVisit,
        motivo_consulta: data.reason,
        paciente: {
          ...this.visitaActual.paciente,
          observaciones_importantes: data.observations
        }
      }).subscribe({
        next: res => {
          console.log('ACTUALIZADO', res);
          this.router.navigate(['/agenda']);
        },
        error: err => console.log('ERROR BACKEND', err.error)
      });
    } else {
      // Modo creación - crear
      this.agendaService.createVisita({
        fecha: data.date,
        hora_inicio: data.hourVisit,
        motivo_consulta: data.reason,
        paciente: {
          observaciones_importantes: data.observations
        }
      }).subscribe({
        next: res => {
          console.log('OK', res);
          this.router.navigate(['/agenda']);
        },
        error: err => console.log('ERROR BACKEND', err.error)
      });
    }
  }
}