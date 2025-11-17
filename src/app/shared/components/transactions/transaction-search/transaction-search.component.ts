import {Component, inject, input, OnDestroy, OnInit, output} from '@angular/core';
import {
  getTransactionSearchForm,
  TransactionSearch,
  TransactionSearchForm
} from '../../../forms/transactions/transaction-search-form';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, Subscription} from 'rxjs';
import {InputText} from 'primeng/inputtext';
import {Fluid} from 'primeng/fluid';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';

@Component({
  selector: 'kc-transaction-search',
  imports: [
    InputText,
    ReactiveFormsModule,
    Fluid,
    DatePickerModule
  ],
  templateUrl: 'transaction-search.component.html'
})
export class TransactionSearchComponent implements OnInit, OnDestroy {
  private readonly _fb = inject(FormBuilder);

  private formSubscription!: Subscription;

  public readonly form = input<FormGroup<TransactionSearchForm>>(getTransactionSearchForm(this._fb));
  public readonly valueChanges = output<Partial<TransactionSearch>>();

  ngOnInit(): void {
    this.formSubscription = this.form().valueChanges
      .pipe(debounceTime(300))
      .subscribe(changes => {
        if (this.form().invalid)
          return;


        this.valueChanges.emit(changes as Partial<TransactionSearch>)
      })
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
