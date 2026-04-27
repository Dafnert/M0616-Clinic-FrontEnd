import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Visita } from '../models/visita.model';

const API_BASE = 'http://localhost/clinicBackEnd/api';

// Mock data for development until backend is ready
const MOCK_VISITAS: Visita[] = [
  {
    id_visita: 1,
    fecha: '2026-04-14',
    hora_inicio: '09:00',
    hora_fin: '09:30',
    motivo_consulta: 'Limpieza dental',
    estado: 'pendiente',
    paciente: { id_paciente: 1, dni: '12345678A', nombre: 'Laura', apellidos: 'García López' },
    odontologo: { id_odontologo: 1, nombre: 'Dr. Torreiglesias', apellidos: '', email: '' },
    box: { id_box: 1, nombre: 'Box 1' },
  },
  {
    id_visita: 2,
    fecha: '2026-04-14',
    hora_inicio: '10:30',
    hora_fin: '11:30',
    motivo_consulta: 'Ortodoncia - revisión',
    estado: 'pendiente',
    paciente: { id_paciente: 2, dni: '87654321B', nombre: 'Marcos', apellidos: 'Ruiz Fernández', observaciones_importantes: 'Alérgico a la penicilina' },
    odontologo: { id_odontologo: 2, nombre: 'Dr. Trujillo', apellidos: '', email: '' },
    box: { id_box: 2, nombre: 'Box 2' },
  },
  {
    id_visita: 3,
    fecha: '2026-04-15',
    hora_inicio: '09:00',
    hora_fin: '10:00',
    motivo_consulta: 'Extracción molar',
    estado: 'pendiente',
    paciente: { id_paciente: 3, dni: '11223344C', nombre: 'Ana', apellidos: 'Martínez Soto' },
    odontologo: { id_odontologo: 1, nombre: 'Dr. Torreiglesias', apellidos: '', email: '' },
    box: { id_box: 1, nombre: 'Box 1' },
  },
  {
    id_visita: 4,
    fecha: '2026-04-15',
    hora_inicio: '11:00',
    hora_fin: '11:30',
    motivo_consulta: 'Blanqueamiento dental',
    estado: 'pendiente',
    paciente: { id_paciente: 4, dni: '44332211D', nombre: 'Adri', apellidos: 'Vazquez Cordero' },
    odontologo: { id_odontologo: 3, nombre: 'Dr. Rodríguez', apellidos: '', email: '' },
    box: { id_box: 3, nombre: 'Box 3' },
  },
];

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private http = inject(HttpClient);

  getVisitas(fecha?: string): Observable<Visita[]> {
    // When backend is ready, replace with:
    // const params = fecha ? `?fecha=${fecha}` : '';
    // return this.http.get<Visita[]>(`${API_BASE}/visitas${params}`);
    return of(MOCK_VISITAS);
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/visitas/${id}`);
  }
}
