import {Component, inject, signal} from '@angular/core';
import {PageComponent} from '../../shared/components/page/page.component';
import {Button} from 'primeng/button';
import {TransactionService} from '../../shared/services/transaction.service';
import {ItemListComponent, ItemListItem} from '../../shared/components/item-list/item-list.component';
import {DataCard} from '../../shared/components/loading-card/data-card';
import {
  ImportTransactionsComponent
} from '../../shared/components/transactions/import-transactions/import-transactions.component';
import {DrawerComponent} from '../../shared/components/drawer/drawer.component';
import {
  TransactionSearchComponent
} from '../../shared/components/transactions/transaction-search/transaction-search.component';
import {TransactionSearch} from '../../shared/forms/transactions/transaction-search-form';
import {DateUtils} from '../../shared/utils/date';
import {ListSortType} from '../../shared/models/enum/list-sort-type';

@Component({
  selector: 'kc-transaction-page',
  imports: [
    Button,
    DataCard,
    ItemListComponent,
    ImportTransactionsComponent,
    DrawerComponent,
    TransactionSearchComponent
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

  protected async loadTransactions(query?: Partial<TransactionSearch>): Promise<void> {
    this.loading.set(true);

    if (!query) {
      const dateRange = DateUtils.thisMonth();
      query = {
        startDate: dateRange[0],
        endDate: dateRange[1],
        transactionDateOrder: ListSortType.descending
      }
    }

    const transactions = await this._transaction.getTransactions(query, {size: 100, page: 0});

    this.items.set(transactions.map(t => ({
      title: t.name,
      subTitle: this._transaction.getTransactionSubTitle(t.accountName, t.accountNumber),
      value: t.amount
    })));

    this.loading.set(false);
  }
}
