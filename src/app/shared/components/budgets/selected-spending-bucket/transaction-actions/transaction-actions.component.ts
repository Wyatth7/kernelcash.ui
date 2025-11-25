import {Component, input, model, output, signal} from '@angular/core';
import {ItemListItem} from '../../../item-list/item-list.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-transaction-actions',
  templateUrl: 'transaction-actions.component.html'
})
export class TransactionActionsComponent {
 public readonly itemAdded = input.required<boolean>();
}
