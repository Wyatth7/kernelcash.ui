import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CoreComponent} from './core/core.component';
import {BudgetHomePageComponent} from './pages/budget/budget-home-page.component';
import {BudgetViewerComponent} from './pages/budget/budget-viewer/budget-viewer.component';

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
        path: 'budgets',
        component: BudgetHomePageComponent,
      },
      {
        path: 'budgets/:budgetId',
        component: BudgetViewerComponent
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
