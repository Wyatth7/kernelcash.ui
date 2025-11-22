import {Component, computed, inject, input, OnChanges, output, signal} from '@angular/core';
import {SelectedSpendingBucketView} from '../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {ItemListItem} from '../../item-list/item-list.component';
import {TransactionService} from '../../../services/transaction.service';
import {UnallocatedTransaction} from '../../../models/transactions/unallocated-transaction';
import {TotalTextComponent} from '../total-text/total-text.component';
import {AllocatedTransactionsViewComponent} from './allocated-transactions-view/allocated-transactions-view.component';
import {
  BudgetDateRange,
  UnallocatedTransactionsViewComponent
} from './unallocated-transactions-view/unallocated-transactions-view.component';

export enum SelectedView {
  Allocated,
  Unallocated
}

@Component({
  selector: 'kc-selected-spending-bucket',
  imports: [
    TotalTextComponent,
    AllocatedTransactionsViewComponent,
    UnallocatedTransactionsViewComponent
  ],
  templateUrl: 'selected-spending-bucket.component.html'
})
export class SelectedSpendingBucketComponent implements OnChanges {
  private readonly _transaction = inject(TransactionService);

  private _previousSpendingBucketId!: number;

  public readonly spendingBucketId = input.required<number>();
  public readonly budgetDateRange = input.required<BudgetDateRange>();
  public readonly resetContent = input<boolean>(false);
  public readonly reload = output<void>();

  protected readonly selectedSpendingBucket = signal<SelectedSpendingBucketView | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly existingTransactionView = signal<boolean>(true);
  protected readonly unallocatedTransactions = signal<UnallocatedTransaction[]>([]);

  protected readonly selectedView = signal<SelectedView>(SelectedView.Allocated);

  protected readonly remainingBudgetAmount = signal<number>(0);

  async ngOnChanges(): Promise<void> {
    if (this.resetContent()) {
      this.onResetContent();
      return;
    }

    if (this._previousSpendingBucketId === this.spendingBucketId())
      return;

    this._previousSpendingBucketId = this.spendingBucketId();
  }

  protected spendingBucketLoaded(spendingBucket: SelectedSpendingBucketView): void {
    this.selectedSpendingBucket.set(spendingBucket);
    this.remainingBudgetAmount.set(spendingBucket.remaining ?? 0);
  }



  protected async transactionsCreated(remaining: number): Promise<void> {
    const selectedBucket = this.selectedSpendingBucket();
    if (selectedBucket?.remaining)
      selectedBucket.remaining = remaining;

    this.reload.emit();
  }


  protected calculateTotalRemaining(value: number): void {
    const totalRemaining = this.selectedSpendingBucket()?.remaining ?? 0;

    this.remainingBudgetAmount.set(totalRemaining + value);
  }

  private onResetContent(): void {
    this.selectedView.set(SelectedView.Allocated);
    this.existingTransactionView.set(true);
    this.unallocatedTransactions.set([]);
  }

  protected readonly SelectedView = SelectedView;
}
