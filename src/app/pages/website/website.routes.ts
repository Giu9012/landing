import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Home } from './home/home';

export const websiteRoutes: Routes = [
  {
    path: '',
    component: Home,
    children:[
      {
        path: '',
        pathMatch:'full',
        redirectTo: 'home',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(websiteRoutes)],
  exports: [RouterModule]
})
export class WebsiteRoutesModule {}