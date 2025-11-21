import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {createSpendingBucketForm, SpendingBucketForm} from '../../../../forms/budgets/create-budget/create-budget-form';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {Divider} from 'primeng/divider';
import {Button} from 'primeng/button';
import {DEFAULT_EXPENSE_CATEGORIES, SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {Select} from 'primeng/select';
import {Subscription} from 'rxjs';

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
export class SpendingBucketArrayInputComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);
  private readonly _spendingBucket = inject(SpendingBucketService);

  public readonly namePlaceholder = input<string>('Your items name...');
  public readonly spendingBucketFormArray = input.required<FormArray<FormGroup<SpendingBucketForm>>>();
  public readonly addText = input('Add')
  public readonly requireCategory = input<boolean>(true);
  public readonly defaultCategory = input<string>(DEFAULT_EXPENSE_CATEGORIES[0]);
  public readonly lastCategory = signal<string>(DEFAULT_EXPENSE_CATEGORIES[0]);

  protected readonly categories = signal<string[]>([...DEFAULT_EXPENSE_CATEGORIES]);

  private _categoryFormSubscription!: Subscription;

  async ngOnInit(): Promise<void> {
    if (!this.requireCategory()) {
      for (const control of this.spendingBucketFormArray().controls) {
        control.controls.category.setValue(this.defaultCategory());
      }
      return;
    }

    this._categoryFormSubscription = this.spendingBucketFormArray().valueChanges.subscribe(changes => {
      this.lastCategory.set(changes[changes.length - 1].category ?? this.defaultCategory());
    })

    const categories = await this._spendingBucket.getCategories();
    this.categories.set(categories);
  }

  public ngOnDestroy(): void {
    if (this._categoryFormSubscription)
      this._categoryFormSubscription.unsubscribe();
  }

  protected addSpendingBucket(): void {
    this.spendingBucketFormArray().push(
        createSpendingBucketForm(this._fb, {category: this.lastCategory()})
    );
  }

  protected removeSpendingBudget(position: number): void {
    if (this.spendingBucketFormArray().length <= 1)
      return;

    this.spendingBucketFormArray().removeAt(position);
  }
}
