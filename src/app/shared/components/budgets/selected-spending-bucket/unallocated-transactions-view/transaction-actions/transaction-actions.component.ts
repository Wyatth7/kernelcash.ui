import {Component, input, output, signal} from '@angular/core';
import {ItemListItem} from '../../../../item-list/item-list.component';
import {Button} from 'primeng/button';

export type SpendingTransactionChanged = {
  transactionId: number;
  amount: number;
}

@Component({
  selector: 'kc-transaction-actions',
  imports: [
    Button
  ],
  templateUrl: 'transaction-actions.component.html'
})
export class TransactionActionsComponent {
  public readonly item = input.required<ItemListItem>();
  public readonly spendingTransactionAdded = output<SpendingTransactionChanged>();
  public readonly spendingTransactionRemoved = output<number>();

  protected readonly itemAdded = signal<boolean>(false);
  protected readonly itemSplit = signal<boolean>(false);

  protected addItem(): void {
    const item = this.item();
    if (!item.id) return;

    this.itemAdded.set(true);
    this.spendingTransactionAdded.emit({
      transactionId: +item.id,
      amount: +item.value
    })
  }

  protected splitItem(): void {
    // do nothing for now...

    // this.itemAdded.set(true);
    // this.itemSplit.set(true);
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
  }
}
