import {Component, contentChild, input, TemplateRef} from '@angular/core';
import {ItemListItem} from '../../../item-list/item-list.component';

@Component({
  selector: 'kc-list-with-actions',
  templateUrl: 'list-with-actions.component.html'
})
export class ListWithActionsComponent {
  public readonly title = input<string>();
}
