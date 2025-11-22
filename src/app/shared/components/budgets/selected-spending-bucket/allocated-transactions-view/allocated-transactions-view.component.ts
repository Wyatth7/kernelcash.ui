import {Component, inject, input, OnChanges, OnInit, output, signal} from '@angular/core';
import {SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {SelectedSpendingBucketView} from '../../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {ItemListItem} from '../../../item-list/item-list.component';
import {TransactionService} from '../../../../services/transaction.service';
import {ListWithActionsComponent} from '../list-with-actions/list-with-actions.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-allocated-transactions-view',
  imports: [
    ListWithActionsComponent,
    Button
  ],
  templateUrl: 'allocated-transactions-view.component.html'
})
export class AllocatedTransactionsViewComponent implements OnInit, OnChanges {
  private readonly _spendingBucket = inject(SpendingBucketService);
  private readonly _transaction = inject(TransactionService);

  public readonly spendingBucketId = input.required<number>();
  public readonly loading = output<boolean>();
  public readonly spendingBucketLoaded = output<SelectedSpendingBucketView>();
  public readonly onAddTransactionsClicked = output<void>();

  public readonly transactionItems = signal<ItemListItem[]>([]);
  public readonly isEditing = signal<boolean>(false);

  public readonly spendingBucketTransactionsToRemove = signal<number[]>([]);

  public async ngOnInit(): Promise<void> {
    await this.loadSpendingBucket();
  }

  public async ngOnChanges(): Promise<void> {
    await this.loadSpendingBucket();
  }

  private async loadSpendingBucket(): Promise<void> {
    if (this.spendingBucketId() === 0)
      return;

    this.loading.emit(true);

    const spendingBucket = await this._spendingBucket
      .getSpendingBucketAndTransactions(this.spendingBucketId());

    this.spendingBucketLoaded.emit(spendingBucket);

    this.transactionItems.set(
      spendingBucket.spendingBucketTransactions.map(sb => ({
        title: sb.transactionName,
        subTitle: this._transaction.getTransactionSubTitle(sb.accountName, sb.accountNumber),
        value: sb.amount,
        spendingBucketTransactionId: sb.spendingBucketTransactionId
      }))
    )

    this.loading.emit(false);
  }

  protected markToRemove(spendingBucketTransactionId: number): void {
    this.spendingBucketTransactionsToRemove().push(spendingBucketTransactionId)
    console.log(this.spendingBucketTransactionsToRemove())
  }

  protected cancel(): void {
    this.spendingBucketTransactionsToRemove.set([]);
    this.isEditing.set(false);
  }

  protected addTransactionClicked(): void {
    this.cancel();
    this.onAddTransactionsClicked.emit();
  }
}
