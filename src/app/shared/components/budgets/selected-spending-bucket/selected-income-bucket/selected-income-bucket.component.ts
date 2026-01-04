import {Component, inject, input, output, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {SelectedSpendingBucketView} from '../../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {FormControlComponent} from '../../../form/form-control/form-control.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {SpendingBucketService} from '../../../../services/budget/spending-bucket.service';
import {RecordedIncomeData} from '../../../../models/budgets/recorded-income-data';

enum IncomeRecordingState {
  Start,
  Planned,
  AmountEntry
}

@Component({
  selector: 'kc-selected-income-bucket',
  imports: [
    Button,
    FormControlComponent,
    InputNumber,
    ReactiveFormsModule
  ],
  templateUrl: 'selected-income-bucket.component.html'
})
export class SelectedIncomeBucketComponent {
  private readonly _spendingBucket = inject(SpendingBucketService);

  public readonly selectedSpendingBucket = input<SelectedSpendingBucketView>();
  public readonly recordedIncomeData = output<RecordedIncomeData>();

  protected readonly amountControl = new FormControl<number>(0.00);
  protected readonly didNotMakeTotal = signal<boolean>(false);
  protected readonly incomeRecordingState = signal<IncomeRecordingState>(IncomeRecordingState.Start);

  protected async recordIncome(amount: number | null = 0): Promise<void> {
    const result = await this._spendingBucket.recordIncome(this.selectedSpendingBucket()!.spendingBucketId, amount ?? 0);

    if (result)
      this.recordedIncomeData.emit(result);
  }

  protected readonly IncomeRecordingState = IncomeRecordingState;
}
