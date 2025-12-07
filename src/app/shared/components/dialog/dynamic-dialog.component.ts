import {Component, inject, input, OnInit, Type} from '@angular/core';
import {NgComponentOutlet} from '@angular/common';
import {Button} from 'primeng/button';
import {CustomDialogService} from '../../services/custom-dialog.service';

@Component({
  selector: 'kc-dynamic-dialog',
  imports: [
    NgComponentOutlet,
    Button
  ],
  templateUrl: 'dynamic-dialog.component.html'
})
export class DynamicDialogComponent {
  private readonly _dialog = inject(CustomDialogService);

  public readonly title = input<string>();
  public readonly message = input<string>();
  public readonly component = input.required<Type<any> | null>();
  public readonly closable = input<boolean>(true);

  public readonly cancelText = input<string>('Cancel');
  public readonly showCancel = input<boolean>(false);

  public readonly actionText = input<string>('Ok');
  public readonly showAction = input<boolean>(true);
  public readonly action = input<() => Promise<void>>();
  public readonly canUseAction = input<boolean>(true);

  public readonly id = input.required<string>();

  protected async actionClicked(): Promise<void> {
    await this.action()?.();
    this.close();
  }

  protected close(): void {
    this._dialog.close(this.id());
  }
}
