import {Component, input, OnChanges, OnDestroy, OnInit, output, signal, SimpleChanges} from '@angular/core';
import {
  TransactionActionsComponent
} from '../../transaction-actions/transaction-actions.component';
import {Button} from 'primeng/button';
import {ItemListItem} from '../../../../item-list/item-list.component';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {Subscription} from 'rxjs';

export type SpendingTransactionChanged = {
  transactionId: number;
  amount: number;
}

@Component({
  selector: 'kc-unallocated-transaction-action',
  imports: [
    TransactionActionsComponent,
    Button,
    InputNumber,
    ReactiveFormsModule
  ],
  templateUrl: 'unallocated-transaction-action.component.html'
})
export class UnallocatedTransactionActionComponent implements OnInit, OnDestroy, OnChanges {
  public readonly item = input.required<ItemListItem>();
  public readonly shouldClear = input.required<boolean>();

  public readonly spendingTransactionAdded = output<SpendingTransactionChanged>();
  public readonly spendingTransactionRemoved = output<number>();
  public readonly isValid = output<boolean>();

  protected readonly itemAdded = signal<boolean>(false);
  protected readonly itemSplit = signal<boolean>(false);

  protected splitAmountControl!: FormControl<number | null>;
  protected splitAmountControlChangesSubscription!: Subscription;

  private _shouldClear = false;

  public ngOnInit(): void {
    this.splitAmountControl = new FormControl<number>(Math.abs(+this.item().value), [Validators.min(0), Validators.max(Math.abs(+this.item().value))])

    this.splitAmountControlChangesSubscription = this.splitAmountControl.valueChanges
      .subscribe(value => {
        this.isValid.emit(this.splitAmountControl.valid && this.itemSplit());

        value ??= 0;

        const defaultItemValue = Math.abs(+this.item().value);
        if (value < 0.01)
          this.splitAmountControl.setValue(0.01);

        if (value > defaultItemValue)
          this.splitAmountControl.setValue(defaultItemValue);


        if (!this.itemSplit() || value <= 0.01 || value > Math.abs(+this.item().value))
          return;


        this.addItem({...this.item(), value: -1 * value});
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const shouldClear = changes['shouldClear'];
    if (!shouldClear ||  shouldClear.currentValue === this._shouldClear)
      return;

    this.splitAmountControl.reset();
  }

  public ngOnDestroy(): void {
    this.splitAmountControlChangesSubscription.unsubscribe();
  }

  protected addItem(item?: ItemListItem): void {
    item ??= this.item();
    if (!item.id) return;

    this.itemAdded.set(true);
    this.spendingTransactionAdded.emit({
      transactionId: +item.id,
      amount: +item.value
    })
  }

  protected splitItem(): void {
    this.itemSplit.set(true);
    this.splitAmountControl.setValue(Math.abs(+this.item().value));
  }

  protected removeItem(): void {
    const id = this.item().id;
    if (!id) return;

    this.clearState();
    this.spendingTransactionRemoved.emit(+id);
  }

  private clearState(): void {
    this.itemAdded.set(false);
    this.itemSplit.set(false);
    this.splitAmountControl.reset();
  }
}
