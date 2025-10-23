import {Component, inject, signal} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {ButtonModule} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IconStepComponent} from '../../../stepper/icon-step/icon-step.component';
import {FileUpload} from 'primeng/fileupload';
import {environment} from '../../../../../../environments/environment';
import {AuthenticationService} from '../../../../services/authentication.service';
import {HttpHeaders} from '@angular/common/http';
import {BudgetWriteService} from '../../../../services/budget/budget-write.service';
import {
  createBudgetForm,
  CreateBudgetForm,
  getFullBudgetValue
} from '../../../../forms/budgets/create-budget/create-budget-form';
import {SpendingBucketArrayInputComponent} from '../spending-bucket-array-input/spending-bucket-array-input.component';

@Component({
  selector: 'kc-budget-create-form',
  imports: [
    ButtonModule,
    StepperModule,
    InputText,
    FormsModule,
    IconStepComponent,
    FileUpload,
    ReactiveFormsModule,
    SpendingBucketArrayInputComponent
  ],
  templateUrl: 'budget-create-form.component.html'
})
export class BudgetCreateFormComponent {
  private readonly _authentication = inject(AuthenticationService);
  private readonly _budgetWriter = inject(BudgetWriteService);
  private readonly _fb = inject(FormBuilder);

  protected readonly uploadUrl = `${environment.apiUrl}transactions/import`
  protected readonly headers: HttpHeaders;

  protected readonly form = signal<FormGroup<CreateBudgetForm>>(createBudgetForm(this._fb)).asReadonly();
  protected readonly formSubmitting = signal<boolean>(false);

  protected activeStep: number = 1;

  constructor() {
    const headers = new HttpHeaders();

    headers.set('Authorization', `Bearer ${this._authentication.token}`);
    this.headers = headers
  }

  protected async submitBudget(callback: (value: number) => unknown): Promise<void> {
    try {
      this.formSubmitting.set(true);
      await this._budgetWriter
        .createFullBudget(
          this._authentication.currentUser.budgetGroupId,
          getFullBudgetValue(this.form())
        );

      this.formSubmitting.set(false);

      callback(4);
    } catch {
      this.formSubmitting.set(false)
    }
  }
}
