import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Home } from './home/home';

export const PlataformaRoutes: Routes = [
  {
    path: '',
    component: Home,
    children:[
      {
        path: '',
        pathMatch:'full',
        redirectTo: 'home',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(PlataformaRoutes)],
  exports: [RouterModule]
})
export class WebsiteRoutesModule {}