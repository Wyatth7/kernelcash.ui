import {Component, inject, input, signal} from '@angular/core';
import {LoadingCardComponent} from '../../loading-card/loading-card.component';
import {BudgetListComponent} from '../budget-list/budget-list.component';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';
import {Page} from '../../../models/pagination/page';

@Component({
  selector: 'kc-budget-card',
  imports: [
    LoadingCardComponent,
    BudgetListComponent
  ],
  templateUrl: 'budget-card.component.html'
})
export class BudgetCardComponent {
  private readonly _router = inject(Router);
  protected readonly auth = inject(AuthenticationService);

  public readonly page = input<Page>({size: 5, page: 0});

  protected readonly loading = signal<boolean>(true);

  protected async navigateToBudgetPage(): Promise<void> {
    await this._router.navigate(['app', 'budgets'])
  }
}
