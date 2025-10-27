import {Component, input} from '@angular/core';
import {ItemListComponent, ItemListItem} from '../item-list/item-list.component';
import {DataCard} from '../loading-card/data-card';

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
    ItemListComponent
  ],
  templateUrl: 'data-card-with-items-list.component.html'
})
export class DataCardWithItemsListComponent {
  public readonly itemList = input.required<ItemList[]>()

  protected async actionClicked(item: ItemList): Promise<void> {
  }
}
