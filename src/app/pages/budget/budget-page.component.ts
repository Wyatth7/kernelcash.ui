import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {Drawer} from 'primeng/drawer';
import {BudgetCreateFormComponent} from '../../shared/components/budgets/budget-form/budget-create-form/budget-create-form.component';

@Component({
  selector: 'kc-budget-page',
  imports: [
    Button,
    Drawer,
    BudgetCreateFormComponent
  ],
  templateUrl: 'budget-page.component.html'
})
export class BudgetPageComponent {

  protected showCreateForm: boolean = false;

}
