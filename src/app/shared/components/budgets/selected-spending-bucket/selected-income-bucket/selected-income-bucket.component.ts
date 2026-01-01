import {Component, input, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {SelectedSpendingBucketView} from '../../../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {FormControlComponent} from '../../../form/form-control/form-control.component';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'kc-selected-income-bucket',
  imports: [
    Button,
    FormControlComponent
  ],
  templateUrl: 'selected-income-bucket.component.html'
})
export class SelectedIncomeBucketComponent {
  protected readonly didNotMakeTotal = signal<boolean>(false);

  public readonly selectedSpendingBucket = input<SelectedSpendingBucketView>();

  protected readonly amountControl = new FormControl();

  // protected hasMadeTotalAmount(): Promise<void> {
  //
  // }
  //
  // protected
}
