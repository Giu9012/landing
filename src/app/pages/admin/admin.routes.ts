import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayout } from '../admin-layout/admin-layout';



export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // default to dashboard
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // load dashboard (standalone component)

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutesModule {}