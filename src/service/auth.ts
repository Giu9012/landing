import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../app/environments/environments';
import { LoginResponse } from '../interfaces/auth';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL + '/auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private roleKey = 'role';
  private router = inject(Router);

  constructor() {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.setRole(response.role);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private setRole(role: string) {
    localStorage.setItem(this.roleKey, role);
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, { token: refreshToken }).pipe(
      tap(response => localStorage.setItem(this.accessTokenKey, response.accessToken))
    );
  }
}
