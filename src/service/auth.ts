import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../app/environments/environments';
import { LoginResponse } from '../interfaces/auth';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
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

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthState();
  }

  private checkAuthState(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem(this.accessTokenKey);
      const role = localStorage.getItem(this.roleKey);
      this.isAuthenticatedSubject.next(!!token && !!role);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (typeof window !== 'undefined' && window.localStorage) {
          this.setTokens(response.accessToken, response.refreshToken);
          this.setRole(response.role);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.roleKey);
      this.isAuthenticatedSubject.next(false);
    }
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem(this.accessTokenKey) && !!localStorage.getItem(this.roleKey);
    }
    return false;
  }

  getRole(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.roleKey);
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.accessTokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  private setRole(role: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.roleKey, role);
    }
  }

  refreshToken(): Observable<{ accessToken: string; refreshToken?: string }> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const refreshToken = localStorage.getItem(this.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return this.http.post<{ accessToken: string; refreshToken?: string }>(`${this.apiUrl}/refresh`, { token: refreshToken }).pipe(
        tap(response => {
          if (typeof window !== 'undefined' && window.localStorage) {
            this.setTokens(response.accessToken, response.refreshToken || refreshToken);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(error => {
          console.error('Token refresh failed', error);
          this.logout();
          return throwError(() => new Error('Token refresh failed'));
        })
      );
    }
    return throwError(() => new Error('Not in browser context'));
  }
}
