import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {TransactionService} from '../../../services/transaction.service';
import {TransactionQuery} from '../../../models/transactions/transaction-query';
import {Transaction} from '../../../models/transactions/transaction';
import {TransactionQueryParams} from '../../../models/transactions/transaction-query-params';
import {DataView} from 'primeng/dataview';
import {Avatar} from 'primeng/avatar';
import {CurrencyPipe, NgClass} from '@angular/common';
import {TransactionQueryItem} from '../../../models/transactions/transaction-query-item';

@Component({
  selector: 'kc-transaction-list',
  imports: [
    DataView,
    Avatar,
    CurrencyPipe,
    NgClass
  ],
  templateUrl: 'transaction-list.component.html'
})
export class TransactionListComponent implements OnInit {
  private readonly _transactionService = inject(TransactionService);

  public readonly parameters = input<Partial<TransactionQuery>>();
  public readonly dataLoaded = output<void>();

  protected readonly transactions = signal<TransactionQueryItem[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadTransactions();
  }

  protected async loadTransactions(): Promise<void> {
    this.transactions.set(await this._transactionService.getTransactions(this.queryValues));
    this.dataLoaded.emit();
  }

  private get queryValues(): TransactionQueryParams {
    const now = new Date();

    return {
      startDate: new Date(this.parameters()?.startDate ?? new Date(now.setMonth(now.getMonth() - 1))).toISOString(),
      endDate: new Date(this.parameters()?.endDate ?? new Date()).toISOString(),
      size: this.parameters()?.size ?? 100,
      page: this.parameters()?.page ?? 0
    }
  }

  protected getTransactionSubTitle(transaction: TransactionQueryItem): string {
    if (transaction.accountName)
      return transaction.accountName;

    return `Account ending in ${transaction.accountNumber}`;
  }
}
