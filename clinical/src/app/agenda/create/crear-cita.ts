import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';
import { PatientService } from '../../services/patient.service';
import { DoctorService, Doctor } from '../../services/doctor.service';

const DURACIO_PER_ESPECIALITAT: Record<string, number> = {
  'Ortodòncia':        60,
  'Ortodoncia':        60,
  'Implants':          90,
  'Implantologia':     90,
  'Cirurgia':          60,
  'Cirugia oral':      60,
  'Periodoncia':       45,
  'Endodòncia':        45,
  'Endodoncia':        45,
  'Blanqueament':      60,
  'Blanqueamiento':    60,
  'Pròtesis':          45,
  'Protesis':          45,
  'Medicina General':  30,
  'Revisió':           20,
  'Revision':          20,
  'Neteja':            30,
  'Higiene dental':    30,
};

function getDuracio(speciality: string): number {
  if (!speciality) return 30;
  const key = Object.keys(DURACIO_PER_ESPECIALITAT).find(
    k => speciality.toLowerCase().includes(k.toLowerCase())
  );
  return key ? DURACIO_PER_ESPECIALITAT[key] : 30;
}

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
  duracionCita = 30;

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

  private slotToMinutes(slot: string): number {
    const [h, m] = slot.split(':').map(Number);
    return h * 60 + m;
  }

  actualizarHoresLliures(date: string) {
    if (!date) {
      this.horasLibres = [...this.horasDisponibles];
      return;
    }
    this.agendaService.getVisitas().subscribe({
      next: (visites) => {
        const citesDelDia = visites.filter(
          v => v.fecha === date && v.id_visita !== this.visitaId
        );

        // Per cada cita existent, bloqueja tots els slots que cobreixi segons la seva durada
        const slotsBloquejats = new Set<string>();
        for (const cita of citesDelDia) {
          const inici = this.slotToMinutes(cita.hora_inicio.substring(0, 5));
          const duracio = getDuracio((cita as any).doctor?.speciality ?? '');
          for (let t = inici; t < inici + duracio; t += 5) {
            const hh = String(Math.floor(t / 60)).padStart(2, '0');
            const mm = String(t % 60).padStart(2, '0');
            slotsBloquejats.add(`${hh}:${mm}`);
          }
        }

        // Bloqueja també els slots que solaparien amb la nova cita (de durada duracionCita)
        const durNova = this.duracionCita;
        this.horasLibres = this.horasDisponibles.filter(slot => {
          if (slotsBloquejats.has(slot)) return false;
          // Comprova que la nova cita (slot + durNova) no solapa cap cita existent
          const iniciNou = this.slotToMinutes(slot);
          for (const cita of citesDelDia) {
            const iniciExist = this.slotToMinutes(cita.hora_inicio.substring(0, 5));
            const durExist = getDuracio((cita as any).doctor?.speciality ?? '');
            if (iniciNou < iniciExist + durExist && iniciNou + durNova > iniciExist) {
              return false;
            }
          }
          return true;
        });
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
    this.patientService.getAll().subscribe({
      next: (patients) => { this.patients = patients; },
      error: (err) => console.log('ERROR AL CARGAR PACIENTES', err)
    });

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

    this.form.get('doctorId')!.valueChanges.subscribe(id => {
      const doctor = this.doctors.find(d => d.id == id);
      this.duracionCita = doctor ? getDuracio(doctor.speciality) : 30;
      const date = this.form.get('date')!.value;
      if (date) this.actualizarHoresLliures(date);
    });

    this.form.get('date')!.valueChanges.subscribe(date => {
      this.actualizarHoresLliures(date);
    });

    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Error al cargar doctores', err)
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.visitaId = params['id'];
        this.titulo = 'Actualitzar cita';
        this.cargarVisita(params['id']);
      } else {
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
        const doctor = this.doctors.find(d => d.id == visita.doctor?.id);
        this.duracionCita = doctor ? getDuracio(doctor.speciality) : 30;
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
    this.errorMessage = null;
    const data = this.form.value;

    if (!data.date || !data.hourVisit || !data.doctorId) {
      this.errorMessage = 'Falten camps obligatoris: data, hora i doctor.';
      return;
    }

    this.ejecutarGuardado(data);
  }

  private ejecutarGuardado(data: any) {
    if (this.isEditMode && this.visitaId) {
      this.agendaService.updateVisita(this.visitaId, {
        fecha: data.date,
        hora_inicio: data.hourVisit,
        motivo_consulta: data.reason,
        observations: data.observations,
        patientId: data.patientId,
        doctorId: data.doctorId,
        duration: this.duracionCita,
      }).subscribe({
        next: () => this.router.navigate(['/agenda']),
        error: err => this.errorMessage = 'Error del servidor: ' + (err.error?.message || err.statusText)
      });
    } else {
      this.agendaService.createVisita({
        date: data.date,
        hourVisit: data.hourVisit,
        reason: data.reason,
        observations: data.observations,
        patientId: data.patientId,
        doctorId: data.doctorId || null,
        duration: this.duracionCita,
      }).subscribe({
        next: () => this.router.navigate(['/agenda']),
        error: err => this.errorMessage = 'Error del servidor: ' + (err.error?.message || err.statusText)
      });
    }
  }
}
