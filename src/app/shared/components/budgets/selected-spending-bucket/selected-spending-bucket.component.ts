import {Component, computed, inject, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {SpendingBucketService} from '../../../services/budget/spending-bucket.service';
import {SelectedSpendingBucketView} from '../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {SpinnerComponent} from '../../spinner/spinner.component';
import {CurrencyPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {ItemListComponent, ItemListItem} from '../../item-list/item-list.component';
import {TransactionService} from '../../../services/transaction.service';
import {UnallocatedTransaction} from '../../../models/transactions/unallocated-transaction';

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

  private readonly _previousSpendingBucketId!: number;
  public readonly spendingBucketId = input.required<number>();
  public readonly budgetDateRange = input.required<{startDate: Date; endDate: Date}>();
  protected readonly selectedSpendingBucket = signal<SelectedSpendingBucketView | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);

  protected readonly existingTransactionView = signal<boolean>(true);
  protected readonly unallocatedTransactions = signal<UnallocatedTransaction[]>([]);

  protected readonly transactions = computed<ItemListItem[]>(() => {
    if (!this.selectedSpendingBucket())
      return [];

    return this.selectedSpendingBucket()!.spendingBucketTransactions.map(t => ({
      title: t.transactionName,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount,
    }));
  });

  protected readonly unallocatedTransactionsListItems = computed<ItemListItem[]>(() => {
    if (this.unallocatedTransactions().length === 0)
      return [];

    return this.unallocatedTransactions().map(t => ({
      title: t.name,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount - t.splitTransactionWithBudgets.reduce((a, b) => a + b.amount, 0),
    }))
  });

  public async ngOnInit(): Promise<void> {

    await this.loadSpendingBucket();
  }

  async ngOnChanges(changes:SimpleChanges): Promise<void> {
    const change = changes['spendingBucketId']
    if (change.previousValue === change.currentValue)
      return;

    // if (this._previousSpendingBucketId === this.spendingBucketId())
    //   return;

    await this.loadSpendingBucket();
  }

  protected async transactionAction(): Promise<void> {
    this.existingTransactionView.set(!this.existingTransactionView())
    if (this.existingTransactionView()) {
      await this.loadSpendingBucket();
      return;
    }

    console.log('here')
    await this.loadUnallocatedTransactions();
  }

  private async loadSpendingBucket(): Promise<void> {
    if (this.spendingBucketId() === 0)
      return;

    this.loading.set(true);

    const spendingBucket = await this._spendingBucket
      .getSpendingBucketAndTransactions(this.spendingBucketId());

    this.selectedSpendingBucket.set(spendingBucket);

    this.loading.set(false);
  }

  private async loadUnallocatedTransactions(): Promise<void> {
    const unallocatedTransactions = await this._transaction.getUnallocatedTransactions(this.budgetDateRange().startDate, this.budgetDateRange().endDate);
    this.unallocatedTransactions.set(unallocatedTransactions);
  }
}
