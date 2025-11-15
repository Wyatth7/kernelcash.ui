import {Component, ContentChild, Directive, input, TemplateRef} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {CurrencyPipe, NgClass, NgTemplateOutlet} from '@angular/common';
import {DataView} from 'primeng/dataview';
import {RouterLink} from '@angular/router';

export type ItemListItem = {
  title: string;
  value: string | number;
  id?: string | number;
  subTitle?: string;
  linkUrl?: string;
  onClick?: ((item: ItemListItem) => Promise<void>) | ((item: ItemListItem) => void);
  [key: string]: unknown;
}

@Component({
  selector: 'kc-item-list',
  imports: [
    Avatar,
    CurrencyPipe,
    DataView,
    NgClass,
    RouterLink,
    NgTemplateOutlet
  ],
  templateUrl: 'item-list.component.html'
})
export class ItemListComponent {
  @ContentChild('itemBeforeTemplate') itemBeforeTemplate!: TemplateRef<any>;
  @ContentChild('itemAfterTemplate') itemAfterTemplate!: TemplateRef<any>;
  @ContentChild('itemValueTemplate') itemValueTemplate!: TemplateRef<any>;

  public readonly items = input.required<ItemListItem[]>();

  protected async executeAction(item: ItemListItem): Promise<void> {
    if (!item.onClick)
      return;

    await item.onClick(item);
  }
}
