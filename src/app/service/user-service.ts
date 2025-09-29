import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, interval, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environments';
import { JwtPayload, LoginResponse, SignedUrlCache } from '../interfaces/auth';
import { User } from '../interfaces/user';
import { Profile } from '../interfaces/profile';

@Injectable( {
  providedIn: 'root'
} )
export class UserService {
  private apiUrl = environment.API_URL;
  private defaultProfilePicture = 'Multimedia/Imagenes/Usuarios/Perfiles/defaultProfile.webp';
  private signedUrlCache: SignedUrlCache = {};
  private urlCacheSubject = new BehaviorSubject<SignedUrlCache>( {} );
  private readonly REVALIDATION_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private readonly PRELOAD_KEYS = [this.defaultProfilePicture];

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject( PLATFORM_ID ) private platformId: Object
  ) {
    if ( isPlatformBrowser( this.platformId ) ) {
      console.log( 'Browser: Initializing UserService' );
      this.loadSignedUrlCache();
      this.preloadSignedUrls();
      this.startUrlRevalidation();
    }
  }

  private loadSignedUrlCache(): void {
    const cache = localStorage.getItem('signedUrlCache');
    if (cache) {
      const parsedCache: SignedUrlCache = JSON.parse(cache);
      const now = Math.floor(Date.now() / 1000);
      this.signedUrlCache = Object.fromEntries(
        Object.entries(parsedCache).filter(([_, entry]) => entry.exp > now)
      );
      this.saveSignedUrlCache();
      console.log('Browser: Loaded and cleaned signed URL cache', this.signedUrlCache);
    }
  }

  private saveSignedUrlCache(): void {
    localStorage.setItem('signedUrlCache', JSON.stringify(this.signedUrlCache));
    this.urlCacheSubject.next(this.signedUrlCache);
    console.log('Browser: Saved signed URL cache', this.signedUrlCache);
  }

  private preloadSignedUrls(): void {
    console.log('Browser: Preloading signed URLs for keys', this.PRELOAD_KEYS);
    this.refreshSignedUrls(this.PRELOAD_KEYS).subscribe();
  }

  private startUrlRevalidation(): void {
    interval(this.REVALIDATION_INTERVAL).subscribe(() => {
      console.log('Browser: Revalidating signed URLs');
      const now = Math.floor(Date.now() / 1000);
      const expiredKeys = Object.keys(this.signedUrlCache).filter(
        key => this.signedUrlCache[key].exp < now + 60 // 60s buffer
      );
      if (expiredKeys.length > 0) {
        console.log('Browser: Found expired URLs, refreshing', expiredKeys);
        this.refreshSignedUrls(expiredKeys).subscribe();
      }
    });
  }

  getSignedUrlObservable(key: string): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR: Returning placeholder for key', key);
      return of('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+');
    }

    const now = Math.floor(Date.now() / 1000);
    if (this.signedUrlCache[key] && this.signedUrlCache[key].exp > now + 60) {
      console.log('Browser: Using cached signed URL for key', key);
      return of(this.signedUrlCache[key].url);
    }

    return this.getSignedUrl(key);
  }

  getCurrentUser(): Observable<SidebarUser> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR: Returning default user due to server-side execution');
      return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
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
      return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
        map(signedUrl => ({
          avatar: signedUrl,
          title: 'Invitado',
          info: 'Desconocido'
        }))
      );
    }

    // Decode JWT
    let payload: JwtPayload;
    try {
      payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Browser: Decoded JWT', { id: payload.id, role: payload.role });
    } catch (error) {
      console.error('Browser: Failed to decode accessToken', error);
      return this.refreshAccessToken().pipe(
        switchMap(newAccessToken => this.fetchUserData(newAccessToken, null!, null!)),
        catchError(() => {
          console.log('Browser: Token refresh failed, redirecting to login');
          this.logout();
          return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
            map(signedUrl => ({
              avatar: signedUrl,
              title: 'Invitado',
              info: 'Desconocido'
            }))
          );
        })
      );
    }

    if (!payload.id || !payload.role) {
      console.log('Browser: Invalid JWT payload, attempting to refresh');
      return this.refreshAccessToken().pipe(
        switchMap(newAccessToken => this.fetchUserData(newAccessToken, null!, null!)),
        catchError(() => {
          console.log('Browser: Token refresh failed, redirecting to login');
          this.logout();
          return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
            map(signedUrl => ({
              avatar: signedUrl,
              title: 'Invitado',
              info: 'Desconocido'
            }))
          );
        })
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
          return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
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
        return this.getSignedUrlObservable(profilePicture).pipe(
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
            switchMap(newAccessToken => {
              try {
                const newPayload = JSON.parse(atob(newAccessToken.split('.')[1]));
                console.log('Browser: Decoded new JWT', { id: newPayload.id, role: newPayload.role });
                if (!newPayload.id || !newPayload.role) {
                  throw new Error('Invalid new JWT payload');
                }
                return this.fetchUserData(newAccessToken, newPayload.id, newPayload.role);
              } catch (err) {
                console.error('Browser: Failed to decode new accessToken', err);
                this.logout();
                return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
                  map(signedUrl => ({
                    avatar: signedUrl,
                    title: 'Invitado',
                    info: 'Desconocido'
                  }))
                );
              }
            }),
            catchError(() => {
              console.log('Browser: Token refresh failed after 401, redirecting to login');
              this.logout();
              return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
                map(signedUrl => ({
                  avatar: signedUrl,
                  title: 'Invitado',
                  info: 'Desconocido'
                }))
              );
            })
          );
        }
        return this.getSignedUrlObservable(this.defaultProfilePicture).pipe(
          map(signedUrl => ({
            avatar: signedUrl,
            title: 'Invitado',
            info: 'Desconocido'
          }))
        );
      })
    );
  }

  private getSignedUrl(key: string): Observable<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.signedUrlCache[key] && this.signedUrlCache[key].exp > now + 60) {
      console.log('Browser: Using cached signed URL for key', key);
      return of(this.signedUrlCache[key].url);
    }

    return this.fetchSignedUrl(key).pipe(
      tap(({ signedUrl, expiresIn }) => {
        this.signedUrlCache[key] = {
          url: signedUrl,
          exp: Math.floor(Date.now() / 1000) + expiresIn
        };
        this.saveSignedUrlCache();
      }),
      map(({ signedUrl }) => signedUrl)
    );
  }

  private fetchSignedUrl(key: string): Observable<{ signedUrl: string; expiresIn: number }> {
    console.log('Browser: Fetching signed URL for key', key);
    const accessToken = localStorage.getItem('accessToken') || '';
    return this.http.post<{ signedUrl: string }>(`${this.apiUrl}/upload/private/get-signed-url`, { key }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).pipe(
      map(response => ({
        signedUrl: response.signedUrl,
        expiresIn: 3600 // 1 hour, as per backend
      })),
      catchError((error: HttpErrorResponse) => {
        console.error('Browser: Failed to get signed URL', error);
        if (error.status === 401 || error.status === 403) {
          console.log('Browser: 401/403 error, attempting to refresh token');
          return this.refreshAccessToken().pipe(
            switchMap(newAccessToken => this.http.post<{ signedUrl: string }>(`${this.apiUrl}/upload/private/get-signed-url`, { key }, {
              headers: { Authorization: `Bearer ${newAccessToken}` }
            }).pipe(
              map(response => ({
                signedUrl: response.signedUrl,
                expiresIn: 3600
              }))
            )),
            catchError(() => {
              console.log('Browser: Token refresh failed for signed URL, redirecting to login');
              this.logout();
              return of({
                signedUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+',
                expiresIn: 0
              })
            })
          );
        }
        return of({
          signedUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByb2ZpbGU8L3RleHQ+PC9zdmc+',
          expiresIn: 0
        });
      })
    );
  }

  private refreshSignedUrls(keys: string[]): Observable<void> {
    return forkJoin(keys.map(key => this.fetchSignedUrl(key))).pipe(
      tap(results => {
        results.forEach(({ signedUrl, expiresIn }, index) => {
          const key = keys[index];
          this.signedUrlCache[key] = {
            url: signedUrl,
            exp: Math.floor(Date.now() / 1000) + expiresIn
          };
        });
        this.saveSignedUrlCache();
      }),
      map(() => undefined)
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
      localStorage.removeItem('signedUrlCache');
      this.signedUrlCache = {};
      this.urlCacheSubject.next({});
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