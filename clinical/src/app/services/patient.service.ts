import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { LoginResponse, ResponseMessage } from '../messages/ResponseMessage';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private conexHttp:HttpClient) { }
  url = "http://localhost:8000/patients";

  login(username: string, password: string): Observable<LoginResponse> {
    const headers = { 'Content-Type': 'application/json' };
    const data = { username, password };
    return this.conexHttp.post<LoginResponse>(`${this.url}/login`, data, { headers });
  }     
}