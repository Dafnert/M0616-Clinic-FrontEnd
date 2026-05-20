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
      hora_inicio: item.hourVisit?.substring(0, 5) ?? '',
      hora_fin: item.hourVisit?.substring(0, 5) ?? '',
      motivo_consulta: item.reason,
      estado: 'pendiente',
      paciente: {
        id: item.patient?.id ?? 0,
        name: item.patient?.name ?? '---',
        surname: item.patient?.surname ?? '',
        age: item.patient?.age ?? 0,
        dni: item.patient?.dni ?? '---',
        username: item.patient?.username ?? '',
        password: '',
        disease: item.patient?.disease ?? '',
        observations: item.patient?.observations ?? item.observations ?? '',
        tiene_vih: item.patient?.isVih ?? item.patient?.disease?.toLowerCase().includes('vih') ?? false,
        alergias: item.patient?.alergias ?? null,
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
  const body: any = {
  date:         visita.date         ?? visita.fecha,
  hourVisit:    visita.hourVisit    ?? visita.hora_inicio,
  reason:       visita.reason       ?? visita.motivo_consulta,
  observations: visita.observations ?? visita.paciente?.observations ?? '',
  patient_id:   visita.patientId ? parseInt(visita.patientId) : undefined
};

  if (visita.doctorId) {
    body['doctorId'] = visita.doctorId;
  }

  console.log('BODY FINAL:', body);

  return this.http.post<any>(`${API_BASE}/appointment`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  updateVisita(id: number, visita: any): Observable<Visita> {
    const body: any = {};

    if (visita.fecha)           body['date']        = visita.fecha;
    if (visita.hora_inicio)     body['hourVisit']   = visita.hora_inicio;
    if (visita.motivo_consulta) body['reason']      = visita.motivo_consulta;
    if (visita.observations !== undefined) body['observations'] = visita.observations;
    if (visita.patientId)       body['patient_id']  = parseInt(visita.patientId);
    if (visita.doctorId)        body['doctorId']    = visita.doctorId;

    return this.http.put<any>(`${API_BASE}/appointment/${id}`, body).pipe(
      map(response => this.mapItemToVisita(response.data))
    );
  }

  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/appointment/${id}`);
  }
}