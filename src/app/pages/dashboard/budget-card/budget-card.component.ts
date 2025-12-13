import {Component, inject, input, OnInit, signal} from '@angular/core';
import {DataCard} from '../../../shared/components/loading-card/data-card';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {Router} from '@angular/router';
import {Page} from '../../../shared/models/pagination/page';
import {BudgetReadingService} from '../../../shared/services/budget/budget-reading.service';
import {ItemListComponent, ItemListItem} from '../../../shared/components/item-list/item-list.component';
import {TotalTextComponent} from '../../../shared/components/budgets/total-text/total-text.component';

@Component({
  selector: 'kc-budget-card',
  imports: [
    DataCard,
    ItemListComponent,
    TotalTextComponent
  ],
  templateUrl: 'budget-card.component.html'
})
export class BudgetCardComponent implements OnInit {
  private readonly _router = inject(Router);
  protected readonly auth = inject(AuthenticationService);
  private readonly _budget = inject(BudgetReadingService);

  public readonly page = input<Page>({size: 5, page: 0});
  public readonly showLink = input<boolean>(true);

  protected readonly loading = signal<boolean>(true);
  protected readonly budgetListItems = signal<ItemListItem[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  protected async loadData(): Promise<void> {
    this.loading.set(true)
    const data = await this._budget.getBudgetsForGroup(this.auth.getCurrentUser().budgetGroupId, this.page());

    this.budgetListItems.set(
      data.map(b => ({
        title: b.name,
        subTitle: b.budgetGroupName,
        value: b.amount,
        linkUrl: '../budgets/' + b.budgetId.toString(),
        remaining: b.remaining
      }))
    )

    this.loading.set(false);
  }

  protected async navigateToBudgetPage(): Promise<void> {
    await this._router.navigate(['app', 'budgets'])
  }
}
