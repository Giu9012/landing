import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardEstudent } from './dashboard-estudent/dashboard-estudent';
import { DashboardAdmin } from './dashboard-admin/dashboard-admin';
import { DashboardTeacher } from './dashboard-teacher/dashboard-teacher';


export const PlataformaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardEstudent,
    data: {
      title: 'Salón',
      roles: ['niño']
    }
  },
  {
    path: 'dashboard-Admin',
    component: DashboardAdmin,
    data: {
      title: 'Curso',
      roles: ['administrador']
    }
  },
  {
    path: 'dashboard-teacher',
    component: DashboardTeacher,
    data: {
      title: 'Curso',
      roles: ['docente']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(PlataformaRoutes)],
  exports: [RouterModule]
})
export class PlataformaRoutesModule {}