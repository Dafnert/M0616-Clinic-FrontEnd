import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';

const API_BASE = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${API_BASE}/api/stock`);
  }

  create(stock: Omit<Stock, 'id' | 'createdAt' | 'updatedAt'>): Observable<Stock> {
    return this.http.post<Stock>(`${API_BASE}/api/stock`, stock);
  }

  update(id: number, stock: Partial<Stock>): Observable<Stock> {
    return this.http.put<Stock>(`${API_BASE}/api/stock/${id}`, stock);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/api/stock/${id}`);
  }
}
