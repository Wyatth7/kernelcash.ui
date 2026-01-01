import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {PageComponent} from '../../../shared/components/page/page.component';
import {BudgetReadingService} from '../../../shared/services/budget/budget-reading.service';
import {ActivatedRoute} from '@angular/router';
import {BudgetView} from '../../../shared/models/budgets/budget-view';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {
  DataCardWithItemsListComponent,
  ItemList
} from '../../../shared/components/data-card-with-items-list/data-card-with-items-list.component';
import {ItemListItem} from '../../../shared/components/item-list/item-list.component';
import {DrawerComponent} from '../../../shared/components/drawer/drawer.component';
import {
  SelectedSpendingBucketComponent
} from '../../../shared/components/budgets/selected-spending-bucket/selected-spending-bucket.component';
import {TotalTextComponent} from '../../../shared/components/budgets/total-text/total-text.component';
import {SpendingBucketType} from '../../../shared/models/budgets/spending-buckets/spending-bucket-type';

@Component({
  selector: 'kc-budget-viewer',
  imports: [
    SpinnerComponent,
    DataCardWithItemsListComponent,
    DrawerComponent,
    SelectedSpendingBucketComponent,
    TotalTextComponent
  ],
  templateUrl: 'budget-viewer.component.html'
})
export class BudgetViewerComponent extends PageComponent implements OnInit{
  private readonly _budget = inject(BudgetReadingService);
  private readonly _route = inject(ActivatedRoute);

  protected readonly loading = signal<boolean>(true);
  protected readonly budget = signal<BudgetView | undefined>(undefined);
  protected readonly spendingBucketItemList = signal<ItemList[]>([]);
  protected readonly selectedSpendingBucket = signal<ItemListItem | undefined>(undefined);

  protected readonly showSelectedSpendingBucket = signal<boolean>(false);

  protected readonly unallocated = computed<number>(() => {
    if (!this.budget()?.amount || !this.budget()?.spendingBuckets) return 0;

    const bucketTotal = this.budget()?.spendingBuckets.reduce((a, b) =>{
        if (b.spendingBucketType === SpendingBucketType.Income) return a;

        return a + b.total;
      }
      , 0);

    return (this.budget()?.amount ?? 0) - (bucketTotal ?? 0);
  });

  protected get budgetDateRange(): {startDate: Date; endDate: Date;} {
    return {startDate: this.budget()?.startDate ?? new Date(), endDate: this.budget()?.endDate ?? new Date()};
  }

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    await this.loadBudget();
  }

  protected async loadBudget(): Promise<void> {
    this.loading.set(true);

    const response = await this._budget.getBudget(this._route.snapshot.params['budgetId'])
    this.budget.set(response);

    this.setPageTitle(response.name);
    this.spendingBucketItemList.set(this.mapBudgetToList(response));

    this.loading.set(false);
  }

  private mapBudgetToList(budget: BudgetView): ItemList[] {
    return budget.spendingBuckets.reduce((itemList: ItemList[], bucket) => {
      const category = bucket.category;
      const currentCategory = itemList.find(i => i.name === category);

      if (!currentCategory) {
        itemList.push({
          name: category,
          items: [
            {
              title: bucket.name,
              value: bucket.remaining,
              displayValue: bucket.spendingBucketType === SpendingBucketType.Savings && bucket.remaining < 0 ? `+${bucket.remaining}` : bucket.remaining,
              id: bucket.spendingBucketId,
              onClick: this.spendingBucketSelected.bind(this),
              total: bucket.total,
              spendingBucketType: bucket.spendingBucketType
            }
          ]
        })

        return itemList;
      }

      currentCategory.items.push({
        title: bucket.name,
        value: bucket.remaining,
        id: bucket.spendingBucketId,
        displayValue: bucket.spendingBucketType === SpendingBucketType.Savings && bucket.remaining < 0 ? Math.abs(bucket.remaining) : bucket.remaining,
        onClick: this.spendingBucketSelected.bind(this),
        total: bucket.total,
        spendingBucketType: bucket.spendingBucketType
      });

      return itemList;
    }, [])
  }

  protected spendingBucketSelected(item: ItemListItem): void {
    this.selectedSpendingBucket.set(item);
    this.showSelectedSpendingBucket.set(true)
  }

  protected readonly SpendingBucketType = SpendingBucketType;
}
