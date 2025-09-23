import { Routes } from '@angular/router';

export const PlataformaRoutes: Routes = [
  {
    path: '',
    component: Home,
    children:[
      {
        path: '',
        pathMatch:'full',
        loadComponent:() =>
          import('./home/home').then((m) => m.Home),
      }
    ]
  },
];

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Home } from './home/home';

@NgModule({
  imports: [RouterModule.forChild(PlataformaRoutes)],
  exports: [RouterModule]
})
export class WebsiteRoutesModule {}