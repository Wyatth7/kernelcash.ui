import {Component, inject, OnInit, signal} from '@angular/core';
import {DataCard} from '../../loading-card/data-card';
import {TransactionQuery} from '../../../models/transactions/transaction-query';
import {TransactionQueryParams} from '../../../models/transactions/transaction-query-params';
import {TransactionQueryItem} from '../../../models/transactions/transaction-query-item';
import {TransactionService} from '../../../services/transaction.service';
import {ItemListComponent, ItemListItem} from '../../item-list/item-list.component';

@Component({
  selector: 'kc-transaction-card',
  imports: [
    DataCard,
    ItemListComponent
  ],
  templateUrl: 'transaction-card.component.html'
})
export class TransactionCardComponent implements OnInit {
  private readonly _transactionService = inject(TransactionService);

  protected readonly loading = signal<boolean>(true);
  protected readonly transactionQuery: Partial<TransactionQuery> = {
    size: 5
  };

  protected readonly items = signal<ItemListItem[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadTransactions();
  }

  protected async loadTransactions(): Promise<void> {
    this.loading.set(true);
    const transactions = await this._transactionService.getTransactions(this.queryValues);

    this.items.set(transactions.map(t => ({
        title: t.name,
        subTitle: this.getTransactionSubTitle(t),
        value: t.amount
      })
    ));

    this.loading.set(false);
  }

  private get queryValues(): TransactionQueryParams {
    const now = new Date();

    return {
      startDate: new Date(this.transactionQuery?.startDate ?? new Date(now.setMonth(now.getMonth() - 1))).toISOString(),
      endDate: new Date(this.transactionQuery?.endDate ?? new Date()).toISOString(),
      size: this.transactionQuery?.size ?? 100,
      page: this.transactionQuery?.page ?? 0
    }
  }

  protected getTransactionSubTitle(transaction: TransactionQueryItem): string {
    if (transaction.accountName)
      return transaction.accountName;

    return `Account ending in ${transaction.accountNumber}`;
  }
}
