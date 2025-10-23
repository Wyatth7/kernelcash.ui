import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateFullBudget} from '../../../models/budgets/create-full-budget';

export function createBudgetForm(formBuilder: FormBuilder): FormGroup<CreateBudgetForm> {
  return formBuilder.group<CreateBudgetForm>({
    budgetName: new FormControl<string>(new Date().toLocaleDateString(navigator.language, { month: 'long' }), {validators: [Validators.required], nonNullable: true}),
    incomeSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1)),
    expenseSpendingBuckets: new FormArray([createSpendingBucketForm(formBuilder)], Validators.min(1))
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
      ...values.incomeSpendingBuckets.map(i => ({total: i.total, name: i.name})),
      ...values.expenseSpendingBuckets.map(e => ({name: e.name, total: e.total}))
    ]
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
