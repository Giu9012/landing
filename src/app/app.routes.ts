import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/website/website.routes').then(m => m.WebsiteRoutesModule),
  },
  {
    path: 'plataforma',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/plataforma/plataforma.routes').then(m => m.PlataformaRoutesModule),
    data: {
      title: 'Plataforma',
      roles: ['administrador', 'docente', 'niño']
    },
  },
  // {
  //   path: 'oauth-redirect',
  //   loadComponent: () => import('./pages/oauth-redirect/oauth-redirect.component').then(m => m.OauthRedirectComponent),
  // },
  // {
  //   path: 'dashboard',
  //   // canActivate: [authGuard], // Descomentado si quieres protegerlo
  //   loadChildren: () => import('./pages/plataforma/plataforma.routes').then(m => m.PlataformaRoutesModule),
  //   // data: { title: 'Dashboard', roles: ['administrador'] }, // Descomentado si aplicas roles
  // },
  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  // }
];
