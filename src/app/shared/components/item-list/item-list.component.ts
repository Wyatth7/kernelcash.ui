import {Component, input} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {CurrencyPipe, NgClass} from '@angular/common';
import {DataView} from 'primeng/dataview';
import {RouterLink} from '@angular/router';

export type ItemListItem = {
  title: string;
  value: string | number;
  subTitle?: string;
  linkUrl?: string;
  onClick?: () => Promise<void>;
}

@Component({
  selector: 'kc-item-list',
  imports: [
    Avatar,
    CurrencyPipe,
    DataView,
    NgClass,
    RouterLink
  ],
  templateUrl: 'item-list.component.html'
})
export class ItemListComponent {
  public readonly items = input.required<ItemListItem[]>();

  protected async executeAction(item: ItemListItem): Promise<void> {

  }
}
