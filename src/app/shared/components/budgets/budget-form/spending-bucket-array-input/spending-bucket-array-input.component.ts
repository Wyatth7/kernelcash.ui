import {Component, inject, input} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {createSpendingBucketForm, SpendingBucketForm} from '../../../../forms/budgets/create-budget/create-budget-form';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-spending-bucket-array-input',
  templateUrl: 'spending-bucket-array-input.component.html',
  imports: [
    InputNumber,
    InputText,
    ReactiveFormsModule,
    Divider,
    Button
  ]
})
export class SpendingBucketArrayInputComponent {
  private readonly _fb = inject(FormBuilder);

  public readonly spendingBucketFormArray = input.required<FormArray<FormGroup<SpendingBucketForm>>>();
  public readonly addText = input('Add')

  protected addSpendingBucket(): void {
    this.spendingBucketFormArray().push(
        createSpendingBucketForm(this._fb)
      );
  }

  protected removeSpendingBudget(position: number): void {
    if (this.spendingBucketFormArray().length <= 1)
      return;

    this.spendingBucketFormArray().removeAt(position);
  }
}
