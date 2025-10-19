import {Component, signal} from '@angular/core';
import {LoadingCardComponent} from '../../shared/components/loading-card/loading-card.component';
import {TransactionListComponent} from '../../shared/components/transactions/transaction-list/transaction-list.component';
import {
  TransactionCardComponent
} from '../../shared/components/transactions/transaction-card/transaction-card.component';

@Component({
  selector: 'kc-dashboard',
  imports: [
    LoadingCardComponent,
    TransactionListComponent,
    TransactionCardComponent
  ],
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  protected readonly loading = signal<boolean>(true);
}
