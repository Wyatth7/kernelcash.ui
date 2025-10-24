import {Component, signal} from '@angular/core';
import {LoadingCardComponent} from '../../loading-card/loading-card.component';
import {TransactionListComponent} from '../transaction-list/transaction-list.component';
import {TransactionQuery} from '../../../models/transactions/transaction-query';

@Component({
  selector: 'kc-transaction-card',
  imports: [
    LoadingCardComponent,
    TransactionListComponent
  ],
  templateUrl: 'transaction-card.component.html'
})
export class TransactionCardComponent {
  protected readonly loading = signal<boolean>(true);
  protected readonly transactionQuery: Partial<TransactionQuery> = {
    size: 5
  };
}
