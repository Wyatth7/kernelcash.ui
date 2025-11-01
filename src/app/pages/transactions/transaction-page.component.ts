import {Component, inject, signal} from '@angular/core';
import {PageComponent} from '../../shared/components/page/page.component';
import {Button} from 'primeng/button';
import {TransactionService} from '../../shared/services/transaction.service';
import {ItemListComponent, ItemListItem} from '../../shared/components/item-list/item-list.component';
import {
  DataCardWithItemsListComponent
} from '../../shared/components/data-card-with-items-list/data-card-with-items-list.component';
import {DataCard} from '../../shared/components/loading-card/data-card';
import {Drawer} from 'primeng/drawer';
import {
  ImportTransactionsComponent
} from '../../shared/components/transactions/import-transactions/import-transactions.component';
import {DrawerComponent} from '../../shared/components/drawer/drawer.component';

@Component({
  selector: 'kc-transaction-page',
  imports: [
    Button,
    DataCard,
    ItemListComponent,
    ImportTransactionsComponent,
    DrawerComponent
  ],
  templateUrl: 'transaction-page.component.html'
})
export class TransactionPageComponent extends PageComponent{
  override defaultPageTitle = 'My Transactions'

  private readonly _transaction = inject(TransactionService);

  protected readonly items = signal<ItemListItem[]>([]);
  protected readonly loading = signal<boolean>(true);

  protected readonly showTransactionImport = signal<boolean>(false);

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    await this.loadTransactions();
  }

  private async loadTransactions(): Promise<void> {
    this.loading.set(true);

    const date = new Date();
    const transactions = await this._transaction.getTransactions({
      page: 0,
      size: 100,
      startDate: new Date(date.getMonth() - 3).toISOString(),
      endDate: new Date().toISOString()
    });

    this.items.set(transactions.map(t => ({
      title: t.name,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount
    })));

    this.loading.set(false);
  }
}
