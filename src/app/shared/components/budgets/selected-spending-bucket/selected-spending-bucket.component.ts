import {Component, computed, inject, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {SpendingBucketService} from '../../../services/budget/spending-bucket.service';
import {SelectedSpendingBucketView} from '../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {SpinnerComponent} from '../../spinner/spinner.component';
import {CurrencyPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {ItemListComponent, ItemListItem} from '../../item-list/item-list.component';
import {TransactionService} from '../../../services/transaction.service';

@Component({
  selector: 'kc-selected-spending-bucket',
  imports: [
    SpinnerComponent,
    CurrencyPipe,
    Button,
    ItemListComponent
  ],
  templateUrl: 'selected-spending-bucket.component.html'
})
export class SelectedSpendingBucketComponent implements OnInit, OnChanges {
  private readonly _transaction = inject(TransactionService);
  private readonly _spendingBucket = inject(SpendingBucketService);

  public readonly spendingBucketId = input.required<number>();
  protected readonly selectedSpendingBucket = signal<SelectedSpendingBucketView | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);

  protected readonly transactions = computed<ItemListItem[]>(() => {
    if (!this.selectedSpendingBucket())
      return [];

    return this.selectedSpendingBucket()!.spendingBucketTransactions.map(t => ({
      title: t.transactionName,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount,
    }))
  })

  public async ngOnInit(): Promise<void> {
    await this.loadSpendingBucket();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.loadSpendingBucket();
  }

  private async loadSpendingBucket(): Promise<void> {
    if (this.spendingBucketId() === 0)
      return;

    this.loading.set(true);

    const spendingBucket = await this._spendingBucket.getSpendingBucketAndTransactions(this.spendingBucketId());
    this.selectedSpendingBucket.set(spendingBucket);

    this.loading.set(false);
  }
}
