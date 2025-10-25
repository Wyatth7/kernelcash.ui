import {Component, inject, input, OnInit, signal} from '@angular/core';
import {LoadingCardComponent} from '../../loading-card/loading-card.component';
import {BudgetListComponent} from '../budget-list/budget-list.component';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {Page} from '../../../models/pagination/page';
import {BudgetReadingService} from '../../../services/budget/budget-reading.service';
import {ItemListComponent, ItemListItem} from '../../item-list/item-list.component';
import {formatCurrency} from '@angular/common';

@Component({
  selector: 'kc-budget-card',
  imports: [
    LoadingCardComponent,
    ItemListComponent
  ],
  templateUrl: 'budget-card.component.html'
})
export class BudgetCardComponent implements OnInit {
  private readonly _router = inject(Router);
  protected readonly auth = inject(AuthenticationService);
  private readonly _budget = inject(BudgetReadingService);

  public readonly page = input<Page>({size: 5, page: 0});

  protected readonly loading = signal<boolean>(true);
  protected readonly budgetListItems = signal<ItemListItem[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  protected async loadData(): Promise<void> {
    this.loading.set(true)
    const data = await this._budget.getBudgetsForGroup(this.auth.currentUser.budgetGroupId, this.page());

    this.budgetListItems.set(
      data.map(b => ({
        title: b.name,
        subTitle: b.budgetGroupName,
        value: b.amount
      }))
    )

    console.log(this.budgetListItems())
    this.loading.set(false);
  }

  protected async navigateToBudgetPage(): Promise<void> {
    await this._router.navigate(['app', 'budgets'])
  }
}
