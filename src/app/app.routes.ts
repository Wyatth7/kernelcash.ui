import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CoreComponent} from './core/core.component';

export const routes: Routes = [
  {
    path: 'app',
    component: CoreComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/app/home'
  }
];
