import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  diasAgenda = computed<DiaAgenda[]>(() => {
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
        visitas: visitas.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
      }));
  });

  ngOnInit() {
    this.agendaService.getVisitas().subscribe({
      next: (data) => {
        this.visitas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  formatFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dias[date.getDay()]} ${day} de ${meses[month - 1]} de ${year}`;
  }

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  verVisita(id: number) {
    this.router.navigate(['/visita', id]);
  }

  editarVisita(id: number) {
    this.router.navigate(['/visita', id, 'editar']);
  }

  pedirConfirmacion(id: number) {
    this.confirmandoEliminar.set(id);
  }

  cancelarEliminar() {
    this.confirmandoEliminar.set(null);
  }

  confirmarEliminar(id: number) {
    this.visitas.update((lista) => lista.filter((v) => v.id_visita !== id));
    this.confirmandoEliminar.set(null);
    // When backend ready: this.agendaService.deleteVisita(id).subscribe(...)
  }

  crearCita(fecha?: string) {
    this.router.navigate(['/cita/nueva'], { queryParams: fecha ? { fecha } : {} });
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
