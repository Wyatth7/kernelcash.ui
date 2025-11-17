import {Component, inject, OnInit, signal} from '@angular/core';
import {DataCard} from '../../../shared/components/loading-card/data-card';
import {TransactionQuery} from '../../../shared/models/transactions/transaction-query';
import {TransactionQueryParams} from '../../../shared/models/transactions/transaction-query-params';
import {TransactionQueryItem} from '../../../shared/models/transactions/transaction-query-item';
import {TransactionService} from '../../../shared/services/transaction.service';
import {ItemListComponent, ItemListItem} from '../../../shared/components/item-list/item-list.component';
import {Router} from '@angular/router';
import {TransactionSearch} from '../../../shared/forms/transactions/transaction-search-form';

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
  private readonly _router = inject(Router);

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
        subTitle: this._transactionService.getTransactionSubTitle(t.accountName, t.accountNumber),
        value: t.amount
      })
    ));

    this.loading.set(false);
  }

  protected async navigateToTransactions(): Promise<void> {
    this._router.navigate(['app', 'transactions'])
  }

  private get queryValues(): Partial<TransactionSearch> {
    const now = new Date();

    return {
      startDate: new Date(this.transactionQuery?.startDate ?? new Date(now.setMonth(now.getMonth() - 1))),
      endDate: new Date(this.transactionQuery?.endDate ?? new Date()),
    }
  }
}
