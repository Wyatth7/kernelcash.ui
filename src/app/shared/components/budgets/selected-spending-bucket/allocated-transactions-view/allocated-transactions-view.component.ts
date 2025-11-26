import {Component, inject, input, OnChanges, OnInit, output, signal} from '@angular/core';
import {SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {SelectedSpendingBucketView} from '../../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {ItemListComponent, ItemListItem} from '../../../item-list/item-list.component';
import {TransactionService} from '../../../../services/transaction.service';
import {ListWithActionsComponent} from '../list-with-actions/list-with-actions.component';
import {Button} from 'primeng/button';
import {AllocatedActionsComponent} from './allocated-actions/allocated-actions.component';

@Component({
  selector: 'kc-allocated-transactions-view',
  imports: [
    ListWithActionsComponent,
    Button,
    ItemListComponent,
    AllocatedActionsComponent
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
  public readonly remainingValue = output<number>();
  public readonly itemsDeallocated = output<number>();

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
        id: sb.spendingBucketTransactionId
      }))
    );

    this.loading.emit(false);
  }

  protected markToRemove(spendingBucketTransactionId: number): void {
    this.spendingBucketTransactionsToRemove().push(spendingBucketTransactionId);

    if (this.spendingBucketTransactionsToRemove().length == this.transactionItems().length) {
      this.remainingValue.emit(this.transactionItems().reduce((a,b)=> a + +b.value, 0));
      return;
    }

    const value = this.transactionItems()
      .filter(item => !this.spendingBucketTransactionsToRemove()
        .includes(+item.id!)).reduce((a, b) => a + +b.value, 0)

    this.remainingValue.emit(value)
  }

  protected unassignMarkToRemove(spendingBucketTransactionId: number): void {
    this.spendingBucketTransactionsToRemove.set(
      this.spendingBucketTransactionsToRemove().filter(id => id !== spendingBucketTransactionId)
    );
  }

  protected reset(): void {
    this.spendingBucketTransactionsToRemove.set([]);
    this.isEditing.set(false);
  }

  protected async deallocateTransactions(): Promise<void> {
    const remaining = await this._spendingBucket
      .deallocateTransactions(this.spendingBucketTransactionsToRemove(), this.spendingBucketId());

    if (remaining === undefined) return;

    this.itemsDeallocated.emit(remaining);
    this.reset();
    await this.loadSpendingBucket();
  }

  protected addTransactionClicked(): void {
    this.reset();
    this.onAddTransactionsClicked.emit();
  }
}
