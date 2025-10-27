import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Drawer} from 'primeng/drawer';
import {BudgetCreateFormComponent} from '../../shared/components/budgets/budget-form/budget-create-form/budget-create-form.component';
import {PageService} from '../../shared/services/page.service';
import {PageComponent} from '../../shared/components/page/page.component';
import {BudgetCardComponent} from '../dashboard/budget-card/budget-card.component';
import {DrawerComponent} from '../../shared/components/drawer/drawer.component';

@Component({
  selector: 'kc-budget-page',
  imports: [
    Button,
    BudgetCreateFormComponent,
    BudgetCardComponent,
    DrawerComponent
  ],
  templateUrl: 'budget-home-page.component.html'
})
export class BudgetHomePageComponent extends PageComponent {
  override defaultPageTitle = 'My Budgets';

  protected readonly showCreateForm = signal<boolean>(false);
}
