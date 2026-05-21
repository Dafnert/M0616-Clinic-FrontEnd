import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  url = 'http://localhost:8000/patient';

  constructor(private conexHttp: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.conexHttp.get<Patient[]>(`${this.url}/list`);
  }

  getById(id: number): Observable<{ success: boolean; patient: Patient }> {
    return this.conexHttp.get<any>(`${this.url}/${id}`).pipe(
      map(res => res.patient ? res : { success: true, patient: res })
    );
  }

  update(id: number, data: Partial<Patient>): Observable<{ success: boolean; patient: Patient }> {
    return this.conexHttp.put<any>(`${this.url}/${id}`, data).pipe(
      map(res => res.patient ? res : { success: true, patient: res })
    );
  }

  delete(id: number): Observable<any> {
    return this.conexHttp.delete(`${this.url}/${id}`);
  }
}