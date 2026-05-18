import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private url = 'https://localhost:8000/document';

  constructor(private http: HttpClient) {}

  upload(patientId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', String(patientId));
    return this.http.post(`${this.url}/upload/${patientId}`, formData);
  }

  getByPatient(patientId: number): Observable<any> {
    return this.http.get(`${this.url}/patient/${patientId}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  getDownloadUrl(id: number): string {
    return `${this.url}/download/${id}`;
  }
}