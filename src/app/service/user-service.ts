import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environments';
import { JwtPayload, LoginResponse } from '../interfaces/auth';
import { User } from '../interfaces/user';
import { Profile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.API_URL;
  private defaultProfilePicture = 'Multimedia/Imagenes/Usuarios/Perfiles/defaultProfile.webp';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('UserService instantiated, isBrowser:', isPlatformBrowser(this.platformId));
  }

  getCurrentUser(): Observable<SidebarUser> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR: Returning default user due to server-side execution');
      return this.getSignedUrl(this.defaultProfilePicture).pipe(
        map(signedUrl => ({
          avatar: signedUrl,
          title: 'Invitado',
          info: 'Desconocido'
        }))
      );
    }

    console.log('Browser: Attempting to access localStorage for accessToken');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.log('Browser: No accessToken found, redirecting to login');
      this.logout();
      return this.getSignedUrl(this.defaultProfilePicture).pipe(
        map(signedUrl => ({
          avatar: signedUrl,
          title: 'Invitado',
          info: 'Desconocido'
        }))
      );
    }

    let payload: JwtPayload;
    try {
      payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Browser: Decoded JWT', { id: payload.id, role: payload.role });
    } catch (error) {
      console.error('Browser: Failed to decode accessToken', error);
      this.logout();
      return this.getSignedUrl(this.defaultProfilePicture).pipe(
        map(signedUrl => ({
          avatar: signedUrl,
          title: 'Invitado',
          info: 'Desconocido'
        }))
      );
    }

    if (!payload.id || !payload.role) {
      console.log('Browser: Invalid JWT payload, redirecting to login');
      this.logout();
      return this.getSignedUrl(this.defaultProfilePicture).pipe(
        map(signedUrl => ({
          avatar: signedUrl,
          title: 'Invitado',
          info: 'Desconocido'
        }))
      );
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.log('Browser: accessToken expired, attempting to refresh');
      return this.refreshAccessToken().pipe(
        switchMap(newAccessToken => this.fetchUserData(newAccessToken, payload.id, payload.role)),
        catchError(() => {
          console.log('Browser: Token refresh failed, redirecting to login');
          this.logout();
          return this.getSignedUrl(this.defaultProfilePicture).pipe(
            map(signedUrl => ({
              avatar: signedUrl,
              title: 'Invitado',
              info: 'Desconocido'
            }))
          );
        })
      );
    }

    return this.fetchUserData(accessToken, payload.id, payload.role);
  }

  private refreshAccessToken(): Observable<string> {
    console.log('Browser: Refreshing accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('Browser: No refreshToken found');
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      map(response => {
        console.log('Browser: New accessToken received', response.accessToken);
        localStorage.setItem('accessToken', response.accessToken);
        return response.accessToken;
      })
    );
  }

  private fetchUserData(accessToken: string, userId: string, role: 'estudiante' | 'docente' | 'administrador'): Observable<SidebarUser> {
    console.log('Browser: Fetching user and profile for userId:', userId);
    return forkJoin([
      this.http.get<User>(`${this.apiUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }),
      this.http.get<Profile>(`${this.apiUrl}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
    ]).pipe(
      switchMap(([user, profile]) => {
        console.log('Browser: Mapping user and profile data', { user, profile });
        const profilePicture = profile.profilePicture || this.defaultProfilePicture;
        return this.getSignedUrl(profilePicture).pipe(
          map(signedUrl => ({
            avatar: signedUrl,
            title: user.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Usuario',
            info: this.mapRoleToInfo(role)
          }))
        );
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Browser: Failed to fetch user/profile data', error);
        if (error.status === 401) {
          console.log('Browser: 401 error, attempting to refresh token');
          return this.refreshAccessToken().pipe(
            switchMap(newAccessToken => this.fetchUserData(newAccessToken, userId, role)),
            catchError(() => {
              console.log('Browser: Token refresh failed after 401, redirecting to login');
              this.logout();
              return this.getSignedUrl(this.defaultProfilePicture).pipe(
                map(signedUrl => ({
                  avatar: signedUrl,
                  title: 'Invitado',
                  info: 'Desconocido'
                }))
              );
            })
          );
        }
        return this.getSignedUrl(this.defaultProfilePicture).pipe(
          map(signedUrl => ({
            avatar: signedUrl,
            title: 'Invitado',
            info: 'Desconocido'
          }))
        );
      })
    );
  }

  getSignedUrl(key: string): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR: Skipping signed URL generation, returning placeholder');
      return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+');
    }
    return this.http.post<{ signedUrl: string }>(`${this.apiUrl}/upload/private/get-signed-url`, { key }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` }
    }).pipe(
      map(response => {
        console.log('Browser: Signed URL received', response.signedUrl);
        return response.signedUrl;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Browser: Failed to get signed URL', error);
        if (error.status === 401) {
          return this.refreshAccessToken().pipe(
            switchMap(newAccessToken => this.http.post<{ signedUrl: string }>(`${this.apiUrl}/private/get-signed-url`, { key }, {
              headers: { Authorization: `Bearer ${newAccessToken}` }
            }).pipe(
              map(response => response.signedUrl)
            )),
            catchError(() => {
              console.log('Browser: Token refresh failed for signed URL, redirecting to login');
              this.logout();
              return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+');
            })
          );
        }
        return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+');
      })
    );
  }

  getPublicUrl(destination: string, fileName: string): Observable<string> {
    const sanitizedDestination = destination.replace(/[^a-zA-Z0-9-_]/g, '');
    const url = `https://${environment.DOMAIN}/${sanitizedDestination}/${fileName}`;
    console.log('Browser: Generated public URL', url);
    return of(url);
  }

  private logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser: Logging out, clearing localStorage');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    }
  }

  private mapRoleToInfo(role: 'estudiante' | 'docente' | 'administrador'): string {
    switch (role) {
      case 'estudiante':
        return 'Estudiante';
      case 'docente':
        return 'Docente';
      case 'administrador':
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }
}