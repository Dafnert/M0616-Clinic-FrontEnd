import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private conexHttp: HttpClient) {}

  url = 'http://localhost:8000/patient';

  getById(id: number): Observable<{ success: boolean; patient: Patient }> {
    return this.conexHttp.get<{ success: boolean; patient: Patient }>(`${this.url}/${id}`);
  }

  update(id: number, data: Partial<Patient>): Observable<{ success: boolean; patient: Patient }> {
    return this.conexHttp.put<{ success: boolean; patient: Patient }>(`${this.url}/${id}`, data);
  }
}