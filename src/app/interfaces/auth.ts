export interface LoginResponse{
  accessToken: string;
  refreshToken: string;
  role: string;
  id: number;
}

export interface JwtPayload {
  id: string;
  role: 'estudiante' | 'docente' | 'administrador';
  iat: number;
  exp: number;
}

export interface SignedUrlCache {
  [key: string]: { url: string; exp: number };
}