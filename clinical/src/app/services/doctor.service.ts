import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8000/doctor';

  constructor(private http: HttpClient) {}

  getRandomDoctors() {
    return this.http.get<any[]>(`${this.apiUrl}/random`);
  }
}