import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.conexHttp.get<{ success: boolean; patient: Patient }>(`${this.url}/${id}`);
  }

  update(id: number, data: Partial<Patient>): Observable<{ success: boolean; patient: Patient }> {
    return this.conexHttp.put<{ success: boolean; patient: Patient }>(`${this.url}/${id}`, data);
  }
}