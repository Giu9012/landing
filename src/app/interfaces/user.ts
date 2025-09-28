import { Profile } from './profile';

export interface User {
  id: string;
  email: string;
  role: 'niño' | 'docente' | 'administrador';
  name?: string;
  gradeId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  profile?: Profile;
}