import {Component, input, output, signal} from '@angular/core';
import {ItemListItem} from '../../../../item-list/item-list.component';
import {TransactionActionsComponent} from '../../transaction-actions/transaction-actions.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-allocated-actions',
  imports: [
    TransactionActionsComponent,
    Button
  ],
  templateUrl: 'allocated-actions.component.html'
})
export class AllocatedActionsComponent {
  public readonly item = input.required<ItemListItem>();
  public readonly spendingTransactionAdded = output<number>();
  public readonly spendingTransactionRemoved = output<number>();

  protected readonly itemAdded = signal<boolean>(false);

  protected addItem(): void {
    const item = this.item();
    if (!item.id) return;

    this.itemAdded.set(true);
    this.spendingTransactionAdded.emit(item.id as number);
  }

  protected removeItem(): void {
    const id = this.item().id;
    if (!id) return;

    this.clearState();
    this.spendingTransactionRemoved.emit(+id);
  }

  private clearState(): void {
    this.itemAdded.set(false);
  }
}
