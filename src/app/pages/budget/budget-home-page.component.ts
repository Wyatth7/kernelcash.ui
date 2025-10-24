import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Drawer} from 'primeng/drawer';
import {BudgetCreateFormComponent} from '../../shared/components/budgets/budget-form/budget-create-form/budget-create-form.component';
import {PageService} from '../../shared/services/page.service';
import {PageComponent} from '../../shared/components/page/page.component';
import {BudgetCardComponent} from '../../shared/components/budgets/budget-card/budget-card.component';

@Component({
  selector: 'kc-budget-page',
  imports: [
    Button,
    Drawer,
    BudgetCreateFormComponent,
    BudgetCardComponent
  ],
  templateUrl: 'budget-home-page.component.html'
})
export class BudgetHomePageComponent extends PageComponent {
  override pageTitle = 'My Budgets';

  protected showCreateForm: boolean = false;
}
