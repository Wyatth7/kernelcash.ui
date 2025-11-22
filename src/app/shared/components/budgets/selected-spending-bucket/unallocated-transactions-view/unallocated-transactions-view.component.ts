import {Component, computed, inject, input, OnChanges, OnInit, output, signal, SimpleChanges} from '@angular/core';
import {ListWithActionsComponent} from '../list-with-actions/list-with-actions.component';
import {
  SpendingTransactionChanged,
  TransactionActionsComponent
} from './transaction-actions/transaction-actions.component';
import {
  CreateSpendingBucketTransaction
} from '../../../../models/budgets/spending-buckets/create-spending-bucket-transaction';
import {SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {ItemListItem} from '../../../item-list/item-list.component';
import {TransactionService} from '../../../../services/transaction.service';
import {UnallocatedTransaction} from '../../../../models/transactions/unallocated-transaction';
import {Button} from 'primeng/button';

export type BudgetDateRange = {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'kc-unallocated-transactions-view',
  imports: [
    ListWithActionsComponent,
    TransactionActionsComponent,
    Button
  ],
  templateUrl: 'unallocated-transactions-view.component.html'
})
export class UnallocatedTransactionsViewComponent implements OnInit, OnChanges {
  private readonly _spendingBucket = inject(SpendingBucketService);
  private readonly _transaction = inject(TransactionService);

  public readonly spendingBucketId = input.required<number>();
  public readonly budgetDateRange = input.required<BudgetDateRange>();
  public readonly loading = output<boolean>();
  public readonly onCancelClicked = output<void>();
  public readonly remainingValue = output<number>();
  public readonly itemsAdded = output<number>();

  private readonly _spendingBucketTransactionsMap = new Map<number, number>();

  protected readonly unallocatedTransactions = signal<UnallocatedTransaction[]>([]);

  public async ngOnInit(): Promise<void> {
    await this.loadUnallocatedTransactions();
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.loadUnallocatedTransactions();
  }

  private async loadUnallocatedTransactions(): Promise<void> {
    const unallocatedTransactions = await this._transaction.getUnallocatedTransactions(this.budgetDateRange().startDate, this.budgetDateRange().endDate);
    this.unallocatedTransactions.set(unallocatedTransactions);
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

    this.remainingValue.emit(newValue)
  }

  protected async createTransactions(): Promise<void> {
    const newTransactions: CreateSpendingBucketTransaction[] = [];
    for (const [transactionId, amount] of this._spendingBucketTransactionsMap.entries())
      newTransactions.push({transactionId, amount});

    const remaining = await this._spendingBucket.createSpendingBucketTransactions(this.spendingBucketId(), newTransactions);
    if (!remaining)
      return;

    this.itemsAdded.emit(remaining);
  }

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

  protected cancel(): void {
    this._spendingBucketTransactionsMap.clear();
    this.onCancelClicked.emit();
  }
}
