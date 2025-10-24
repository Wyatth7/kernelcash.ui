import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {DataView} from 'primeng/dataview';
import {Avatar} from 'primeng/avatar';
import {CurrencyPipe, NgClass} from '@angular/common';
import {BudgetReadingService} from '../../../services/budget/budget-reading.service';
import {Page} from '../../../models/pagination/page';
import {BudgetQueryListItem} from '../../../models/budgets/budget-query-list-item';

@Component({
  selector: 'kc-budget-list',
  imports: [
    DataView,
    Avatar,
    CurrencyPipe,
    NgClass
  ],
  templateUrl: 'budget-list.component.html'
})
export class BudgetListComponent implements OnInit {
  private readonly _budgetRead = inject(BudgetReadingService);

  public readonly budgetGroupId = input.required<number>();
  public readonly page = input<Page>({size: 5, page: 0});
  public readonly showGroupName = input<boolean>(true);

  public readonly dataLoaded = output<void>();

  protected readonly budgets = signal<BudgetQueryListItem[]>([]);

  async ngOnInit(): Promise<void> {
    const budgets = await this._budgetRead.getBudgetsForGroup(this.budgetGroupId(), this.page());

    this.budgets.set(budgets);
    this.dataLoaded.emit();
  }

}
