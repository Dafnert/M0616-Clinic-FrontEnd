import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.success && response.user) {
          localStorage.setItem('id', response.user.id.toString());
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('username', response.user.username);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('id');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isDoctor(): boolean {
    return this.getRole() === 'DOCTOR';
  }
}
