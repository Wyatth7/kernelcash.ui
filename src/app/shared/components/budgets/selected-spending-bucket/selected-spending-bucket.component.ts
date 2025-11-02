import {Component, computed, inject, input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {SpendingBucketService} from '../../../services/budget/spending-bucket.service';
import {SelectedSpendingBucketView} from '../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {SpinnerComponent} from '../../spinner/spinner.component';
import {CurrencyPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {ItemListComponent, ItemListItem} from '../../item-list/item-list.component';
import {TransactionService} from '../../../services/transaction.service';
import {UnallocatedTransaction} from '../../../models/transactions/unallocated-transaction';
import {
  SpendingTransactionChanged,
  TransactionActionsComponent
} from './transaction-actions/transaction-actions.component';
import {
  CreateSpendingBucketTransaction
} from '../../../models/budgets/spending-buckets/create-spending-bucket-transaction';

@Component({
  selector: 'kc-selected-spending-bucket',
  imports: [
    SpinnerComponent,
    CurrencyPipe,
    Button,
    ItemListComponent,
    TransactionActionsComponent
  ],
  templateUrl: 'selected-spending-bucket.component.html'
})
export class SelectedSpendingBucketComponent implements OnInit, OnChanges {
  private readonly _transaction = inject(TransactionService);
  private readonly _spendingBucket = inject(SpendingBucketService);

  private _previousSpendingBucketId!: number;

  public readonly spendingBucketId = input.required<number>();
  public readonly budgetDateRange = input.required<{startDate: Date; endDate: Date}>();
  public readonly resetContent = input<boolean>(false);

  protected readonly selectedSpendingBucket = signal<SelectedSpendingBucketView | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly existingTransactionView = signal<boolean>(true);
  protected readonly unallocatedTransactions = signal<UnallocatedTransaction[]>([]);

  private readonly _spendingBucketTransactionsMap = new Map<number, number>();
  protected readonly remainingBudgetAmount = signal<number>(0);

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
      id: t.transactionId,
      title: t.name,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount - t.splitTransactionWithBudgets.reduce((a, b) => a + b.amount, 0),
    }))
  });

  public async ngOnInit(): Promise<void> {
    await this.loadSpendingBucket();
  }

  async ngOnChanges(): Promise<void> {
    if (this.resetContent()) {
      this.onResetContent();
      return;
    }

    if (this._previousSpendingBucketId === this.spendingBucketId())
      return;

    this._previousSpendingBucketId = this.spendingBucketId();
    await this.loadSpendingBucket();
  }

  protected async transactionAction(): Promise<void> {
    this.existingTransactionView.set(!this.existingTransactionView())
    if (this.existingTransactionView()) {
      console.log(this._spendingBucketTransactionsMap.size)
      if (this._spendingBucketTransactionsMap.size > 0)
        await this.createTransactions();

      await this.loadSpendingBucket();
      return;
    }

    await this.loadUnallocatedTransactions();
  }

  private async loadSpendingBucket(): Promise<void> {
    if (this.spendingBucketId() === 0)
      return;

    this.loading.set(true);

    const spendingBucket = await this._spendingBucket
      .getSpendingBucketAndTransactions(this.spendingBucketId());

    this.selectedSpendingBucket.set(spendingBucket);
    this.remainingBudgetAmount.set(spendingBucket.remaining ?? 0);

    this.loading.set(false);
  }

  private async loadUnallocatedTransactions(): Promise<void> {
    const unallocatedTransactions = await this._transaction.getUnallocatedTransactions(this.budgetDateRange().startDate, this.budgetDateRange().endDate);
    this.unallocatedTransactions.set(unallocatedTransactions);
  }

  private async createTransactions(): Promise<void> {
    const newTransactions: CreateSpendingBucketTransaction[] = [];
    for (const [transactionId, amount] of this._spendingBucketTransactionsMap.entries())
      newTransactions.push({transactionId, amount});


    const remaining = await this._spendingBucket.createSpendingBucketTransactions(this.spendingBucketId(), newTransactions);
    if (!remaining)
      return;

    const selectedBucket = this.selectedSpendingBucket();
    if (selectedBucket?.remaining)
      selectedBucket.remaining = remaining;
  }

  protected spendingBucketTransactionAdded(spendingBucketTransaction: SpendingTransactionChanged): void {
    this._spendingBucketTransactionsMap.set(spendingBucketTransaction.transactionId, spendingBucketTransaction.amount);
    this.calculateTotalRemaining();
  }

  protected spendingBucketTransactionRemoved(transactionId: number): void {
    this._spendingBucketTransactionsMap.delete(transactionId);
    this.calculateTotalRemaining();
  }

  private calculateTotalRemaining(): void {
    const newValue = Array.from
    (this._spendingBucketTransactionsMap.values()).reduce((a, b) => a + b, 0);

    const totalRemaining = this.selectedSpendingBucket()?.remaining ?? 0;

    this.remainingBudgetAmount.set((totalRemaining + newValue));
  }

  private onResetContent(): void {
    this._spendingBucketTransactionsMap.clear();
    this.existingTransactionView.set(true);
    this.unallocatedTransactions.set([]);
    this.remainingBudgetAmount.set(0)
  }
}
