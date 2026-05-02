import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OdontogramaData, CarasDiente } from '../models/odontograma.model';

const API_BASE = 'http://127.0.0.1:8000';

export interface ToothRecord {
  id: number;
  toothNumber: number;
}

interface BackendTooth {
  id: number;
  toothNumber: number;
  status: string;
  notes: string | null;
  updatedAt: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function derivarStatus(caras: Partial<CarasDiente>): string {
  if (caras.marcador === 'X') return 'extracted';
  if (caras.marcador === 'E') return 'root_canal';
  const colores = [caras.vestibular, caras.lingual, caras.mesial, caras.distal, caras.oclusal];
  if (colores.includes('negro'))   return 'missing';
  if (colores.includes('rojo'))    return 'caries';
  if (colores.includes('azul') || colores.includes('verde') || colores.includes('amarillo')) return 'filled';
  return 'healthy';
}

@Injectable({ providedIn: 'root' })
export class OdontogramaService {
  private http = inject(HttpClient);

  getOdontograma(idPaciente: number): Observable<{ datos: OdontogramaData; records: ToothRecord[]; ultimaActualizacion: string }> {
    return this.http
      .get<ApiResponse<BackendTooth[]>>(`${API_BASE}/odontogram/patient/${idPaciente}`)
      .pipe(
        map(res => {
          const teeth: BackendTooth[] = Array.isArray(res.data) ? res.data : [];
          const datos: OdontogramaData = {};
          const records: ToothRecord[] = [];
          let ultimaActualizacion = '';

          for (const t of teeth) {
            records.push({ id: t.id, toothNumber: t.toothNumber });
            if (t.updatedAt && t.updatedAt > ultimaActualizacion) {
              ultimaActualizacion = t.updatedAt;
            }
            try {
              if (t.notes) datos[t.toothNumber] = JSON.parse(t.notes);
            } catch { /* ignorar notes inválidas */ }
          }

          return { datos, records, ultimaActualizacion };
        })
      );
  }

  saveOdontograma(idPaciente: number, datos: OdontogramaData, existingRecords: ToothRecord[]): Observable<any> {
    const recordMap = new Map(existingRecords.map(r => [r.toothNumber, r.id]));

    const requests: Observable<any>[] = Object.entries(datos).map(([numStr, caras]) => {
      const toothNumber = Number(numStr);
      const status = derivarStatus(caras);
      const notes = JSON.stringify(caras);
      const existingId = recordMap.get(toothNumber);

      if (existingId) {
        return this.http.put(`${API_BASE}/odontogram/${existingId}`, { status, notes });
      }
      return this.http.post(`${API_BASE}/odontogram`, { patientId: idPaciente, toothNumber, status, notes });
    });

    return requests.length > 0 ? forkJoin(requests) : of(null);
  }
}
