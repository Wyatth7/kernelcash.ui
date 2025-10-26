import {Component, inject, OnInit, signal} from '@angular/core';
import {PageComponent} from '../../../shared/components/page/page.component';
import {BudgetReadingService} from '../../../shared/services/budget/budget-reading.service';
import {ActivatedRoute} from '@angular/router';
import {BudgetView} from '../../../shared/models/budgets/budget-view';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {
  DataCardWithItemsListComponent, ItemList
} from '../../../shared/components/data-card-with-items-list/data-card-with-items-list.component';
import {SpendingBucket} from '../../../shared/models/budgets/spending-buckets/spending-bucket';
import {ItemListItem} from '../../../shared/components/item-list/item-list.component';

@Component({
  selector: 'kc-budget-viewer',
  imports: [
    SpinnerComponent,
    DataCardWithItemsListComponent
  ],
  templateUrl: 'budget-viewer.component.html'
})
export class BudgetViewerComponent extends PageComponent implements OnInit{
  private readonly _budget = inject(BudgetReadingService);
  private readonly _route = inject(ActivatedRoute);

  protected readonly loading = signal<boolean>(true);
  protected readonly budget = signal<BudgetView | undefined>(undefined);
  protected readonly spendingBucketItemList = signal<ItemList[]>([]);

  public override async ngOnInit(): Promise<void> {
    super.ngOnInit();

    await this.loadBudget();
  }

  private async loadBudget(): Promise<void> {
    this.loading.set(true);

    const response = await this._budget.getBudget(this._route.snapshot.params['budgetId'])
    this.budget.set(response);

    this.setPageTitle(response.name);
    this.spendingBucketItemList.set(this.mapBudgetToList(response));

    this.loading.set(false);
  }

  private mapBudgetToList(budget: BudgetView): ItemList[] {
    const groupedItems = budget.spendingBuckets.reduce((itemList: ItemList[], bucket) => {
      const category = bucket.category;
      const currentCategory = itemList.find(i => i.name === category);

      console.log({
        bucket,
        category,
        currentCategory
      })

      if (!currentCategory) {
        itemList.push({
          name: category,
          items: [
            {
              title: bucket.name,
              value: bucket.remaining
            }
          ]
        })

        return itemList;
      }

      currentCategory.items.push({
        title: bucket.name,
        value: bucket.remaining
      });

      return itemList;
    }, [])

    console.log(groupedItems);
    return groupedItems;
  }
}
