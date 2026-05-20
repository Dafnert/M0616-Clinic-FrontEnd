import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
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
  errorMessage: string | null = null;

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
        this.form = this.fb.group({
          patientId: [visita.paciente?.id || ''],
          date: [visita.fecha],
          hourVisit: [visita.hora_inicio],
          reason: [visita.motivo_consulta],
          observations: [visita.paciente?.observations || ''],
          doctorId: [visita.doctor?.id || '']
        });
      },
      error: (err) => {
        console.log('ERROR AL CARGAR VISITA', err);
        this.router.navigate(['/agenda']);
      }
    });
  }

  guardar() {
    this.errorMessage = null;

    if (this.form.invalid) {
      this.errorMessage = 'Formulari de cita invàlid';
      return;
    }

    const data = this.form.value;

    // =========================================================================
    // REGLA 1: Test appointment depends on treatment/reason, doctor and time
    // =========================================================================
    if (!data.reason || !data.doctorId || !data.date || !data.hourVisit) {
      this.errorMessage = 'Falten camps obligatoris: La cita depèn del tractament/motiu, metge i hora.';
      return;
    }

    // Diccionario de duraciones estimadas por tratamiento (en minutos)
    const DURACION_TRATAMIENTO: Record<string, number> = {
      'Dentista': 30,
      'Neteja': 20,
      'Ortodòncia': 45,
      'Revisió': 15,
      'default': 30 // Duración por defecto si no coincide con ninguna clave anterior
    };

    // =========================================================================
    // REGLA 2: Test 5 min before-after every appointment (Márgenes de seguridad)
    // =========================================================================
    this.agendaService.getVisitas().subscribe({
      next: (visitasExistentes) => {
        
        // Convertimos la hora de inicio de la NUEVA cita a minutos absolutos
        const [nuevaHora, nuevaMinutos] = data.hourVisit.split(':').map(Number);
        const nuevaInicio = nuevaHora * 60 + nuevaMinutos;
        
        // Calculamos la hora de finalización de la nueva cita según su tipo
        const duracionNueva = DURACION_TRATAMIENTO[data.reason] || DURACION_TRATAMIENTO['default'];
        const nuevaFin = nuevaInicio + duracionNueva;

        const hayConflicto = visitasExistentes.some(visita => {
          if (this.isEditMode && visita.id_visita === Number(this.visitaId)) {
            return false;
          }

          const mismoDoctor = Number(visita.doctor?.id) === Number(data.doctorId);
          const mismaFecha = visita.fecha === data.date;

          if (mismoDoctor && mismaFecha) {
            // Conversión de la cita guardada en base de datos
            const [vHora, vMinutos] = visita.hora_inicio.split(':').map(Number);
            const viejaInicio = vHora * 60 + vMinutos;
            
            const duracionVieja = DURACION_TRATAMIENTO[visita.motivo_consulta] || DURACION_TRATAMIENTO['default'];
            const viejaFin = viejaInicio + duracionVieja;

            // Añadir el margen obligatorio de 5 minutos de descanso
            const viejaFinConMargen = viejaFin + 5;
            const nuevaFinConMargen = nuevaFin + 5;

            // Comprobación de solapamiento de intervalos de tiempo
            const solapaAntes = (nuevaInicio >= viejaInicio && nuevaInicio < viejaFinConMargen);
            const solapaDespues = (viejaInicio >= nuevaInicio && viejaInicio < nuevaFinConMargen);

            return solapaAntes || solapaDespues;
          }
          return false;
        });

        if (hayConflicto) {
          this.errorMessage = 'Error: Hi ha d’haver un marge mínim de 5 minuts abans i després amb qualsevol altra cita d’aquest doctor.';
          return;
        }

        this.ejecutarGuardado(data);
      },
      error: (err) => {
        console.error('Error al verificar conflictos de agenda', err);
        this.errorMessage = 'No s\'ha pogut verificar la disponibilitat de la cita.';
      }
    });
  }

  private ejecutarGuardado(data: any) {
    if (this.isEditMode && this.visitaId) {
      this.agendaService.updateVisita(this.visitaId, {
        fecha: data.date,
        hora_inicio: data.hourVisit,
        motivo_consulta: data.reason,
        paciente: {
          ...this.visitaActual.paciente,
          observaciones_importantes: data.observations
        }
      }).subscribe({
        next: res => this.router.navigate(['/agenda']),
        error: err => this.errorMessage = 'Error del servidor en actualitzar: ' + (err.error?.message || err.statusText)
      });
    } else {
      this.agendaService.createVisita({
        date: data.date,
        hourVisit: data.hourVisit,
        reason: data.reason,
        observations: data.observations,
        patientId: data.patientId,
        doctorId: data.doctorId || null
      }).subscribe({
        next: res => this.router.navigate(['/agenda']),
        error: err => this.errorMessage = 'Error del servidor en crear: ' + (err.error?.message || err.statusText)
      });
    }
  }
}