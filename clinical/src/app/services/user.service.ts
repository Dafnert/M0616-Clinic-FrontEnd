import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../models/user';
import { LoginResponse } from '../messages/ResponseMessage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private conexHttp: HttpClient) { }
  url = "http://localhost:8000/user";

  getAll(): Observable<any[]> {
    return this.conexHttp.get<any[]>(`${this.url}`);
  }

  getById(id: number): Observable<any> {
    return this.conexHttp.get(`${this.url}/${id}`);
  }

  register(user: user): Observable<any> {
    return this.conexHttp.post(`${this.url}`, user);
  }

  create(data: { name: string; surname: string; age: number; speciality: string; username: string; password: string; role: string }): Observable<any> {
    return this.conexHttp.post(`${this.url}`, data);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.conexHttp.post<LoginResponse>(`${this.url}/login`, { username, password }, { headers });
  }

  update(id: number, data: Partial<user>): Observable<any> {
    return this.conexHttp.put(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.conexHttp.delete(`${this.url}/${id}`);
  }
}
