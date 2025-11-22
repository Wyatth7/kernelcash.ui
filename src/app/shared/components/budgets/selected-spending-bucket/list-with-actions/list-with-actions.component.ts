import {Component, contentChild, input, signal, TemplateRef} from '@angular/core';
import {ItemListComponent, ItemListItem} from '../../../item-list/item-list.component';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'kc-list-with-actions',
  imports: [
    ItemListComponent,
    NgTemplateOutlet
  ],
  templateUrl: 'list-with-actions.component.html'
})
export class ListWithActionsComponent {
  public readonly title = input<string>();
  public readonly items = input.required<ItemListItem[]>();

  public readonly actionTemplate = contentChild<TemplateRef<any>>('actionTemplate');
}
