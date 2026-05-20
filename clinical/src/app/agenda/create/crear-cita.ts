import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';
import { PatientService } from '../../services/patient.service';
import {Patient} from '../../models/patient';
import { DoctorService, Doctor } from '../../services/doctor.service';


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
  doctors: Doctor[] = [];

  selectedPatient: any = null;

  horasDisponibles: string[] = (() => {
    const slots: string[] = [];
    for (let h = 10; h <= 19; h++) {
      for (let m = 0; m < 60; m += 5) {
        if (h === 19 && m > 30) break;
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return slots;
  })();

  horasLibres: string[] = [];

  actualizarHoresLliures(date: string) {
    if (!date) {
      this.horasLibres = [...this.horasDisponibles];
      return;
    }
    this.agendaService.getVisitas().subscribe({
      next: (visites) => {
        const reservades = visites
          .filter(v => v.fecha === date && v.id_visita !== this.visitaId)
          .map(v => v.hora_inicio.substring(0, 5));
        this.horasLibres = this.horasDisponibles.filter(h => !reservades.includes(h));
      },
      error: () => {
        this.horasLibres = [...this.horasDisponibles];
      }
    });
  }

  get patientHasVih(): boolean {
    return !!(this.selectedPatient?.isVih ?? this.selectedPatient?.disease?.toLowerCase().includes('vih'));
  }

  get patientHasAlergias(): boolean {
    return !!this.selectedPatient?.alergias;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private agendaService: AgendaService,
    private patientService: PatientService,
    private doctorService: DoctorService,
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
      observations: [''],
      doctorId: ['']
    });

    this.horasLibres = [...this.horasDisponibles];

    this.form.get('patientId')!.valueChanges.subscribe(id => {
      this.selectedPatient = this.patients.find(p => p.id == id) ?? null;
      if (this.patientHasVih) {
        this.form.get('hourVisit')!.setValue('19:30');
      }
    });

    this.form.get('date')!.valueChanges.subscribe(date => {
      this.actualizarHoresLliures(date);
    });

    // Cargar lista de doctores
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Error al cargar doctores', err)
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
        this.selectedPatient = visita.paciente ?? null;
        this.form = this.fb.group({
          patientId: [visita.paciente?.id || ''],
          date: [visita.fecha],
          hourVisit: [visita.hora_inicio],
          reason: [visita.motivo_consulta],
          observations: [visita.paciente?.observations || ''],
          doctorId: [visita.doctor?.id || '']
        });
        this.actualizarHoresLliures(visita.fecha);
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
      this.agendaService.updateVisita(this.visitaId, {
        fecha: data.date,
        hora_inicio: data.hourVisit,
        motivo_consulta: data.reason,
        observations: data.observations,
        patientId: data.patientId,
        doctorId: data.doctorId,
      }).subscribe({
        next: () => this.router.navigate(['/agenda']),
        error: err => console.log('ERROR BACKEND', err.error)
      });
    } else {
      // Modo creación - crear
      this.agendaService.createVisita({
  date: data.date,
  hourVisit: data.hourVisit,
  reason: data.reason,
  observations: data.observations,
  patientId: data.patientId,      // ← añadir
  doctorId: data.doctorId || null
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