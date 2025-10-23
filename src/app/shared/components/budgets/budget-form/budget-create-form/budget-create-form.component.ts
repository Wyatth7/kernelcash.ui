import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
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
import {Message} from 'primeng/message';
import {CurrencyPipe, NgClass} from '@angular/common';
import {Subscription} from 'rxjs';

type IncomeExpenseComparison = {
  value: number;
  invalid: boolean;
}

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
    SpendingBucketArrayInputComponent,
    Message,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: 'budget-create-form.component.html'
})
export class BudgetCreateFormComponent implements OnInit, OnDestroy {
  private readonly _authentication = inject(AuthenticationService);
  private readonly _budgetWriter = inject(BudgetWriteService);
  private readonly _fb = inject(FormBuilder);

  protected readonly uploadUrl = `${environment.apiUrl}transaction/import`
  protected readonly headers: HttpHeaders;

  protected readonly form = signal<FormGroup<CreateBudgetForm>>(createBudgetForm(this._fb)).asReadonly();
  protected readonly formSubmitting = signal<boolean>(false);

  private _expenseComparisonSubscription!: Subscription;

  protected readonly expenseComparison = signal<IncomeExpenseComparison>({ value: 0, invalid: false });

  protected activeStep: number = 1;

  constructor() {
    const headers = new HttpHeaders();

    headers.set('Authorization', `Bearer ${this._authentication.token}`);
    this.headers = headers
  }

  public ngOnInit(): void {
    this.form().valueChanges.subscribe(changes => {
      const formValues = this.form().getRawValue();
      const incomeTotal = formValues.incomeSpendingBuckets.reduce((a, b) => a + b.total, 0);
      const expenseTotal = formValues.expenseSpendingBuckets.reduce((a, b) => a + b.total, 0);
      const remaining = incomeTotal - expenseTotal;

      this.expenseComparison.set({
        value: remaining,
        invalid: remaining < 0
      });
    })

  }

  public ngOnDestroy(): void {
    this._expenseComparisonSubscription.unsubscribe();
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
