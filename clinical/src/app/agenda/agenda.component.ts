import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AgendaService } from '../services/agenda.service';
import { DiaAgenda, Visita } from '../models/visita.model';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
})
export class AgendaComponent implements OnInit {
  private agendaService = inject(AgendaService);
  private router = inject(Router);

  visitas = signal<Visita[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  confirmandoEliminar = signal<number | null>(null);
  visitaVisualizando = signal<Visita | null>(null);

  ngOnInit() {
    this.cargarVisitas();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarVisitas();
      });
  }

  cargarVisitas() {
    this.cargando.set(true);

    this.agendaService.getVisitas().subscribe({
      next: (data) => {
        this.visitas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  // =========================
  // CREAR
  // =========================
  crearCita(fecha?: string) {
    this.router.navigate(['/cita/nueva'], {
      queryParams: fecha ? { fecha } : {}
    });
  }

  // =========================
  // VER / EDITAR
  // =========================
  verVisita(id: number) {
    const visita = this.visitas().find(v => v.id_visita === id);
    if (visita) {
      this.visitaVisualizando.set(visita);
    }
  }

  verFichaPaciente(pacienteId: number) {
    this.router.navigate(['/patient/dashboard', pacienteId]);
  }

  cerrarPopup() {
    this.visitaVisualizando.set(null);
  }

  editarVisita(id: number) {
    this.router.navigate(['/cita/editar', id]);
  }

  // =========================
  // ELIMINAR (MODAL)
  // =========================
  pedirConfirmacion(id: number) {
    this.confirmandoEliminar.set(id);
  }

  cancelarEliminar() {
    this.confirmandoEliminar.set(null);
  }

  confirmarEliminar(id: number) {
    this.agendaService.deleteVisita(id).subscribe({
      next: () => {
        this.visitas.update((lista) =>
          lista.filter((v) => v.id_visita !== id)
        );
        this.confirmandoEliminar.set(null);
      },
      error: (err) => {
        console.log('ERROR AL ELIMINAR', err.error);
        this.confirmandoEliminar.set(null);
      }
    });
  }

  // =========================
  // BUSCADOR
  // =========================
  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  // =========================
  // COMPUTED
  // =========================
  diasAgenda = computed<DiaAgenda[]>((() => {
    const termino = this.busqueda().toLowerCase();

    const lista = termino
      ? this.visitas().filter(
        (v) =>
          v.paciente.nombre.toLowerCase().includes(termino) ||
          v.paciente.apellidos.toLowerCase().includes(termino) ||
          v.paciente.dni.toLowerCase().includes(termino) ||
          v.motivo_consulta.toLowerCase().includes(termino),
      )
      : this.visitas();

    const mapa = new Map<string, Visita[]>();

    for (const v of lista) {
      if (!mapa.has(v.fecha)) mapa.set(v.fecha, []);
      mapa.get(v.fecha)!.push(v);
    }

    return Array.from(mapa.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fecha, visitas]) => ({
        fecha,
        fechaLabel: this.formatFecha(fecha),
        visitas: visitas.sort((a, b) =>
          a.hora_inicio.localeCompare(b.hora_inicio)
        ),
      }));
  }));

  // =========================
  // HELPERS
  // =========================
  formatFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return `${dias[date.getDay()]} ${day} de ${meses[month - 1]} de ${year}`;
  }

  estadoClass(estado: string): string {
    const clases: Record<string, string> = {
      pendiente: 'estado-pendiente',
      en_proceso: 'estado-proceso',
      finalizada: 'estado-finalizada',
      cancelada: 'estado-cancelada',
    };
    return clases[estado] ?? '';
  }

  estadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      en_proceso: 'En proceso',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };
    return labels[estado] ?? estado;
  }
}