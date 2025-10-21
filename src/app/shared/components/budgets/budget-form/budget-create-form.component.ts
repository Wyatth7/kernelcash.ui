import {Component} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {NgClass} from '@angular/common';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'kc-budget-create-form',
  imports: [
    NgClass,
    ButtonModule,
    StepperModule
  ],
  templateUrl: 'budget-create-form.component.html'
})
export class BudgetCreateFormComponent {
  protected activeStep: number = 1;
}
