import {Component, signal} from '@angular/core';
import {
  TransactionCardComponent
} from '../../shared/components/transactions/transaction-card/transaction-card.component';

@Component({
  selector: 'kc-dashboard',
  imports: [
    TransactionCardComponent
  ],
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  protected readonly loading = signal<boolean>(true);
}
