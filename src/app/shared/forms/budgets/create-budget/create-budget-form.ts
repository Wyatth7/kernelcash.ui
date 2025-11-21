import {
  AbstractControl, Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CreateBudget} from '../../../models/budgets/create-budget';
import {SpendingBucketType} from '../../../models/budgets/spending-buckets/spending-bucket-type';
import {DEFAULT_EXPENSE_CATEGORIES} from '../../../services/budget/spending-bucket.service';
import {CreateSpendingBucket} from '../../../models/budgets/spending-buckets/create-spending-bucket';

export function createBudgetForm(formBuilder: FormBuilder): FormGroup<CreateBudgetForm> {
  const now  = new Date();
  const nextMonth = new Date(now.setMonth(now.getMonth() + 1))

  return formBuilder.group<CreateBudgetForm>({
    budgetName: new FormControl<string>(new Date().toLocaleDateString(navigator.language, { month: 'long' }), {validators: [Validators.required], nonNullable: true}),
    startDate: new FormControl<Date>(new Date(), {validators: [Validators.required], nonNullable: true}),
    endDate: new FormControl<Date>(nextMonth, {validators: [Validators.required], nonNullable: true}),
    incomeSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1)),
    expenseSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1))
  }, {
    validators: [incomeExpenseValidator(), dateRangeValidator()]
  })
}

export function createSpendingBucketForm(formBuilder: FormBuilder, defaults?: Partial<CreateSpendingBucket>): FormGroup<SpendingBucketForm> {
  return formBuilder.group<SpendingBucketForm>({
    category: new FormControl<string>(defaults?.category ?? DEFAULT_EXPENSE_CATEGORIES[0], {validators: [Validators.required], nonNullable: true}),
    name: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    total: new FormControl<number>(0, {validators: [Validators.required, Validators.min(1)], nonNullable: true})
  })
}

export function getFullBudgetValue(form: FormGroup<CreateBudgetForm>): CreateBudget {
  const values = form.getRawValue();
  return {
    name: values.budgetName,
    amount: values.incomeSpendingBuckets.map(i => i.total).reduce((a, b) => a + b, 0),
    spendingBuckets: [
      ...values.incomeSpendingBuckets.map(i => ({total: i.total, name: i.name, spendingBucketType: SpendingBucketType.Income, category: 'Income'})),
      ...values.expenseSpendingBuckets.map(e => ({name: e.name, total: e.total, spendingBucketType: SpendingBucketType.Expense, category: e.category}))
    ],
    startDate: values.startDate,
    endDate: values.endDate
  }
}

function incomeExpenseValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const formValues = (formGroup as unknown as FormGroup<CreateBudgetForm>).getRawValue();
    const incomeTotal = formValues.incomeSpendingBuckets.reduce((a, b) => a + b.total, 0);
    const expenseTotal = formValues.expenseSpendingBuckets.reduce((a, b) => a + b.total, 0);

    return (incomeTotal - expenseTotal) < 0 ? {expenseGreaterThanIncome: true} : null;
  }
}

function dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const values = (formGroup as unknown as FormGroup<CreateBudgetForm>).getRawValue();

    return values.startDate >= values.endDate ? {invalidDateRage: true} : null;
  }
}

export interface CreateBudgetForm {
  budgetName: FormControl<string>;
  startDate: FormControl<Date>;
  endDate: FormControl<Date>;
  incomeSpendingBuckets: FormArray<FormGroup<SpendingBucketForm>>;
  expenseSpendingBuckets: FormArray<FormGroup<SpendingBucketForm>>;
}

export interface SpendingBucketForm {
  category: FormControl<string>;
  name: FormControl<string>;
  total: FormControl<number>;
}
