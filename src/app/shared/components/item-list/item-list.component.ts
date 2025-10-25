import {Component, input} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {CurrencyPipe, NgClass} from '@angular/common';
import {DataView} from 'primeng/dataview';

export type ItemListItem = {
  title: string;
  subTitle: string;
  value: string | number;
  link?: boolean;
  onClick?: () => Promise<void>;
}

@Component({
  selector: 'kc-item-list',
  imports: [
    Avatar,
    CurrencyPipe,
    DataView,
    NgClass
  ],
  templateUrl: 'item-list.component.html'
})
export class ItemListComponent {
  public readonly items = input.required<ItemListItem[]>();


}
