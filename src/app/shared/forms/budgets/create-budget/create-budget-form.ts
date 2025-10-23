import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CreateFullBudget} from '../../../models/budgets/create-full-budget';
import {SpendingBucketType} from '../../../models/budgets/spending-bucket-type';

export function createBudgetForm(formBuilder: FormBuilder): FormGroup<CreateBudgetForm> {
  return formBuilder.group<CreateBudgetForm>({
    budgetName: new FormControl<string>(new Date().toLocaleDateString(navigator.language, { month: 'long' }), {validators: [Validators.required], nonNullable: true}),
    incomeSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1)),
    expenseSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1))
  }, {
    validators: [incomeExpenseValidator()]
  })
}

export function createSpendingBucketForm(formBuilder: FormBuilder): FormGroup<SpendingBucketForm> {
  return formBuilder.group<SpendingBucketForm>({
    name: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    total: new FormControl<number>(0, {validators: [Validators.required, Validators.min(1)], nonNullable: true})
  })
}

export function getFullBudgetValue(form: FormGroup<CreateBudgetForm>): CreateFullBudget {
  const values = form.getRawValue();
  return {
    name: values.budgetName,
    amount: values.incomeSpendingBuckets.map(i => i.total).reduce((a, b) => a + b, 0),
    spendingBuckets: [
      ...values.incomeSpendingBuckets.map(i => ({total: i.total, name: i.name, spendingBucketType: SpendingBucketType.Income})),
      ...values.expenseSpendingBuckets.map(e => ({name: e.name, total: e.total, spendingBucketType: SpendingBucketType.Expense}))
    ]
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

export interface CreateBudgetForm {
  budgetName: FormControl<string>;
  incomeSpendingBuckets: FormArray<FormGroup<SpendingBucketForm>>;
  expenseSpendingBuckets: FormArray<FormGroup<SpendingBucketForm>>;
}

export interface SpendingBucketForm {
  name: FormControl<string>;
  total: FormControl<number>;
}
