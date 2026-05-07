import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Visita } from '../models/visita.model';

const API_BASE = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private http = inject(HttpClient);

  private mapItemToVisita(item: any): Visita {
    return {
      id_visita: item.id,
      fecha: item.date,
      hora_inicio: item.hourVisit,
      hora_fin: item.hourVisit,
      motivo_consulta: item.reason,
      estado: 'pendiente',
      paciente: {
        id_paciente: item.id,
        dni: '---',
        nombre: 'Paciente',
        apellidos: '',
        observaciones_importantes: item.observations
      },
      odontologo: {
        id_odontologo: 1,
        nombre: 'Doctor',
        apellidos: '',
        email: ''
      },
      box: {
        id_box: 1,
        nombre: 'Box 1'
      },
      doctor: item.doctor ?? undefined
    };
  }

  getVisitas(): Observable<Visita[]> {
    return this.http.get<any>(`${API_BASE}/appointment`).pipe(
      map(response => response.data.map((item: any) => this.mapItemToVisita(item)))
    );
  }

  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<any>(`${API_BASE}/appointment/${id}`).pipe(
      map(response => this.mapItemToVisita(response.data))
    );
  }

  createVisita(visita: any): Observable<Visita> {
    const body: any = {
      date: visita.date,
      hourVisit: visita.hourVisit,
      reason: visita.reason,
      observations: visita.observations ?? ''
    };

    if (visita.doctorId) {
      body['doctorId'] = visita.doctorId;
    }

    console.log('BODY FINAL:', body);

    return this.http.post<any>(`${API_BASE}/appointment`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateVisita(id: number, visita: Partial<Visita>): Observable<Visita> {
    const body: any = {};

    if (visita.fecha)            body['date']         = visita.fecha;
    if (visita.hora_inicio)      body['hourVisit']    = visita.hora_inicio;
    if (visita.motivo_consulta)  body['reason']       = visita.motivo_consulta;
    if (visita.paciente?.observaciones_importantes !== undefined) {
      body['observations'] = visita.paciente.observaciones_importantes;
    }

    return this.http.put<any>(`${API_BASE}/appointment/${id}`, body).pipe(
      map(response => this.mapItemToVisita(response.data))
    );
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/appointment/${id}`);
  }
}