import {Component, signal} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-selected-income-bucket',
  imports: [
    Button
  ],
  templateUrl: 'selected-income-bucket.component.html'
})
export class SelectedIncomeBucketComponent {
  protected readonly didNotMakeTotal = signal<boolean>(false);

  // protected hasMadeTotalAmount(): Promise<void> {
  //
  // }
  //
  // protected
}
