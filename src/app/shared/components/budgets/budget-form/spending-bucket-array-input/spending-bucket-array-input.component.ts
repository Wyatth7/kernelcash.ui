import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {createSpendingBucketForm, SpendingBucketForm} from '../../../../forms/budgets/create-budget/create-budget-form';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {DEFAULT_EXPENSE_CATEGORIES, SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {Select} from 'primeng/select';

@Component({
  selector: 'kc-spending-bucket-array-input',
  templateUrl: 'spending-bucket-array-input.component.html',
  imports: [
    InputNumber,
    InputText,
    ReactiveFormsModule,
    Divider,
    Button,
    Select
  ]
})
export class SpendingBucketArrayInputComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _spendingBucket = inject(SpendingBucketService);

  public readonly spendingBucketFormArray = input.required<FormArray<FormGroup<SpendingBucketForm>>>();
  public readonly addText = input('Add')
  public readonly requireCategory = input<boolean>(true);
  public readonly defaultCategory = input<string>(DEFAULT_EXPENSE_CATEGORIES[0]);

  protected readonly categories = signal<string[]>([...DEFAULT_EXPENSE_CATEGORIES]);

  async ngOnInit(): Promise<void> {
    if (!this.requireCategory()) {
      for (const control of this.spendingBucketFormArray().controls) {
        control.controls.category.setValue(this.defaultCategory());
      }
      return;
    }

    const categories = await this._spendingBucket.getCategories();
    this.categories.set(categories);
  }

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
