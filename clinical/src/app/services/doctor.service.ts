import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Doctor {
  id: number;
  name: string;
  surname: string;
  speciality: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8000/doctor';

  constructor(private http: HttpClient) {}

  getAllDoctors() {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(res => Array.isArray(res) ? res : (res.data ?? res.doctors ?? []))
    );
  }

  getRandomDoctors() {
    return this.http.get<any[]>(`${this.apiUrl}/random`);
  }
}