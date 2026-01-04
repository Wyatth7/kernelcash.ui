import {Component, input, OnChanges, output, signal} from '@angular/core';
import {SelectedSpendingBucketView} from '../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {UnallocatedTransaction} from '../../../models/transactions/unallocated-transaction';
import {TotalTextComponent} from '../total-text/total-text.component';
import {AllocatedTransactionsViewComponent} from './allocated-transactions-view/allocated-transactions-view.component';
import {
  BudgetDateRange,
  UnallocatedTransactionsViewComponent
} from './unallocated-transactions-view/unallocated-transactions-view.component';
import {SpendingBucketType} from '../../../models/budgets/spending-buckets/spending-bucket-type';
import {SelectedIncomeBucketComponent} from './selected-income-bucket/selected-income-bucket.component';
import {RecordedIncomeData} from '../../../models/budgets/recorded-income-data';

export enum SelectedView {
  Allocated,
  Unallocated,
  Income
}

@Component({
  selector: 'kc-selected-spending-bucket',
  imports: [
    TotalTextComponent,
    AllocatedTransactionsViewComponent,
    UnallocatedTransactionsViewComponent,
    SelectedIncomeBucketComponent
  ],
  templateUrl: 'selected-spending-bucket.component.html'
})
export class SelectedSpendingBucketComponent implements OnChanges {
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

    if (this._previousSpendingBucketId === this.spendingBucketId()) {
      return;
    }

    this._previousSpendingBucketId = this.spendingBucketId();
  }

  protected spendingBucketLoaded(spendingBucket: SelectedSpendingBucketView): void {
    this.selectedSpendingBucket.set(spendingBucket);
    const remainingAmount = spendingBucket.spendingBucketType === SpendingBucketType.Savings
    && spendingBucket.remaining < 0
      ? Math.abs(spendingBucket.remaining)
      : spendingBucket.remaining;

    this.remainingBudgetAmount.set(remainingAmount);

    if (this.selectedSpendingBucket()?.spendingBucketType === SpendingBucketType.Income
      && this.selectedSpendingBucket()?.spendingBucketTransactions.length === 0) {
      this.selectedView.set(SelectedView.Income);
    }
  }

  protected async actionRun(remaining: number, allocated = true): Promise<void> {
    const selectedBucket = this.selectedSpendingBucket();
    if (selectedBucket?.remaining)
      selectedBucket.remaining = remaining;

      this.selectedView.set(SelectedView.Allocated);

    this.reload.emit();
  }

  protected async incomeRecorded(data: RecordedIncomeData): Promise<void> {
    this.selectedSpendingBucket()!.total = data.spendingBucketTotal;
    await this.actionRun(0);
  }

  protected calculateTotalRemaining(value: number): void {
    const totalRemaining = this.selectedSpendingBucket()?.remaining ?? 0;

    let remaining = totalRemaining - value;

    // TODO: most likely need to add a check for negative income / savings, and change the user to be green with a +$100.00, ect.
    // if (remaining < 0 && (this.selectedSpendingBucket()?.spendingBucketType === SpendingBucketType.Income || this.selectedSpendingBucket()?.spendingBucketType === SpendingBucketType.Savings))
    //   remaining = Math.abs(remaining); // negative income / savings means excess in earnings or savings.

    this.remainingBudgetAmount.set(remaining);
  }

  private onResetContent(): void {
    this.selectedView.set(SelectedView.Allocated);
    this.existingTransactionView.set(true);
    this.unallocatedTransactions.set([]);
  }

  protected readonly SelectedView = SelectedView;
  protected readonly Math = Math;
  protected readonly SpendingBucketType = SpendingBucketType;
}
