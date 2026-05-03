import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendaService } from '../../services/agenda.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private agendaService: AgendaService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar formulario vacío
    this.form = this.fb.group({
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
          date: [visita.fecha],
          hourVisit: [visita.hora_inicio],
          reason: [visita.motivo_consulta],
          observations: [visita.paciente?.observaciones_importantes || '']
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