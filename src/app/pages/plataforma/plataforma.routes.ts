import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutPlatform } from './layout-platform/layout-platform';


export const PlataformaRoutes: Routes = [
  {
    path: '',
    component: LayoutPlatform,
    children: [
      // default to dashboard
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // load dashboard (standalone component)
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
      },

      // other children can be added here (courses, announcements, etc.)
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(PlataformaRoutes)],
  exports: [RouterModule]
})
export class PlataformaRoutesModule {}