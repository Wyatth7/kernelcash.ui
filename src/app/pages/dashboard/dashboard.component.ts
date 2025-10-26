import {Component, inject, OnInit, signal} from '@angular/core';
import {
  TransactionCardComponent
} from '../../shared/components/transactions/transaction-card/transaction-card.component';
import {BudgetCardComponent} from '../../shared/components/budgets/budget-card/budget-card.component';
import {PageComponent} from '../../shared/components/page/page.component';

@Component({
  selector: 'kc-dashboard',
  imports: [
    TransactionCardComponent,
    BudgetCardComponent
  ],
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends PageComponent {
  override defaultPageTitle = 'My Dashboard'

  protected readonly loading = signal<boolean>(true);
}
