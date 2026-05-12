import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Visita } from '../models/visita.model';
import { Patient } from '../models/patient';
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
        id: item.id,
        name: item.patientName || 'Paciente',
        surname: item.patientSurname || '',
        age: item.patientAge || 0,
        dni: item.patientDni || '---',
        username: item.patientUsername || '',
        password: item.patientPassword || '',
        disease: item.patientDisease || '',
        observations: item.observations
      },
      odontologo: {
        id_odontologo: item.doctor?.id ?? 1,
        nombre: item.doctor?.name ?? '---',
        apellidos: item.doctor?.surname ?? '',
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
  const body = {
    date: visita.fecha,
    hourVisit: visita.hora_inicio,
    reason: visita.motivo_consulta,
    observations: visita.paciente?.observations ?? ''
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
    if (visita.paciente?.observations !== undefined) {
      body['observations'] = visita.paciente.observations;
    }

    return this.http.put<any>(`${API_BASE}/appointment/${id}`, body).pipe(
      map(response => this.mapItemToVisita(response.data))
    );
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/appointment/${id}`);
  }
}