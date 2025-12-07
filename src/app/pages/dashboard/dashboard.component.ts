import {Component, inject, OnInit, signal} from '@angular/core';
import {
  TransactionCardComponent
} from './transaction-card/transaction-card.component';
import {BudgetCardComponent} from './budget-card/budget-card.component';
import {PageComponent} from '../../shared/components/page/page.component';
import {Button, ButtonDirective} from 'primeng/button';
import {CustomDialogService} from '../../shared/services/custom-dialog.service';
import {DialogService} from 'primeng/dynamicdialog';
import {PaymentRequestsComponent} from '../payment-requests/payment-requests.component';

@Component({
  selector: 'kc-dashboard',
  imports: [
    TransactionCardComponent,
    BudgetCardComponent,
    ButtonDirective,
    Button
  ],
  providers: [DialogService],
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends PageComponent {
  override defaultPageTitle = 'My Dashboard'

  protected readonly dialog = inject(CustomDialogService);

  protected openDialog(): void {
    this.dialog.show(PaymentRequestsComponent, {
      title: 'Testing Dialog',
      message: 'This is a cool message to test my dialog',
      showAction: true
    })
  }

  protected readonly loading = signal<boolean>(true);
}
