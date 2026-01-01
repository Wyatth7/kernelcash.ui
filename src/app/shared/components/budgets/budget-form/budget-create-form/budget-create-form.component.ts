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
import {Router} from '@angular/router';
import {ImportTransactionsComponent} from '../../../transactions/import-transactions/import-transactions.component';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';
import {FluidModule} from 'primeng/fluid';

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
    ReactiveFormsModule,
    SpendingBucketArrayInputComponent,
    Message,
    NgClass,
    CurrencyPipe,
    ImportTransactionsComponent,
    DatePickerModule,
    FormsModule,
    FluidModule
  ],
  templateUrl: 'budget-create-form.component.html'
})
export class BudgetCreateFormComponent implements OnInit, OnDestroy {
  private readonly _authentication = inject(AuthenticationService);
  private readonly _budgetWriter = inject(BudgetWriteService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);

  protected readonly form = signal<FormGroup<CreateBudgetForm>>(createBudgetForm(this._fb)).asReadonly();
  protected readonly formSubmitting = signal<boolean>(false);
  protected readonly transactionsUploading = signal<boolean>(false);
  protected readonly createdBudgetId = signal<number>(0);

  private _expenseComparisonSubscription!: Subscription;

  protected readonly expenseComparison = signal<IncomeExpenseComparison>({ value: 0, invalid: false });
  protected activeStep: number = 1;

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
    if (!this._expenseComparisonSubscription)
      return;

    this._expenseComparisonSubscription.unsubscribe();
  }

  protected async submitBudget(callback: (value: number) => unknown): Promise<void> {
    try {
      this.formSubmitting.set(true);
      const budgetId = await this._budgetWriter
        .createFullBudget(
          this._authentication.activeBudgetGroupId,
          getFullBudgetValue(this.form())
        );

      this.formSubmitting.set(false);
      this.createdBudgetId.set(budgetId);
      callback(4);
    } catch {
      this.formSubmitting.set(false)
    }
  }

  protected async navigateToBudgetPage(): Promise<void> {
    if (this.createdBudgetId() <= 0)
      return;

    await this._router.navigate(['app', 'budgets', this.createdBudgetId()]);
  }
}
