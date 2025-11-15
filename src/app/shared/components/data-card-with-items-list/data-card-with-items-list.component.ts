import {Component, ContentChild, input, TemplateRef} from '@angular/core';
import {ItemListComponent, ItemListItem} from '../item-list/item-list.component';
import {DataCard} from '../loading-card/data-card';
import {NgTemplateOutlet} from '@angular/common';

export type ItemList = {
  name: string;
  items: ItemListItem[];
  icon?: string;
  actionText?: string;
  linkUrl?: string;
  action?: () => Promise<void>;
}

@Component({
  selector: 'kc-data-card-with-item-list',
  imports: [
    DataCard,
    ItemListComponent,
    NgTemplateOutlet
  ],
  templateUrl: 'data-card-with-items-list.component.html'
})
export class DataCardWithItemsListComponent {
  public readonly itemList = input.required<ItemList[]>()

  @ContentChild('valueTemplate') valueTemplate!: TemplateRef<unknown>;

  protected async actionClicked(item: ItemList): Promise<void> {
  }
}
