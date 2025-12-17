import {ComponentRef, inject, Injectable, Type} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogComponent} from '../components/dialog/dynamic-dialog.component';
import {DeviceService} from './device.service';

export type DialogConfig = {
  title?: string;
  message?: string;
  showCancel?: boolean;
  cancelText?: string;
  showAction?: boolean;
  actionText?: string;
  action?: () => Promise<void>;
  canUseAction?: boolean;
} & DynamicDialogConfig

@Injectable({providedIn: 'root'})
export class CustomDialogService {
  private readonly _dialog = inject(DialogService);
  private readonly _device = inject(DeviceService);

  private _dialogs = new Map<string, DynamicDialogRef<DynamicDialogComponent>>

  public show(component: Type<any> | null, config?: DialogConfig): DynamicDialogRef<DynamicDialogComponent> | null {
    const dialogId = crypto.randomUUID();

    const dialogRef = this._dialog.open(DynamicDialogComponent, {
      modal: true,
      inputValues: {
        title: config?.title,
        message: config?.message,
        closable: config?.closable ?? true,
        showCancel: config?.showCancel,
        cancelText: config?.cancelText ?? 'Cancel',
        showAction: config?.showAction ?? true,
        actionText: config?.actionText ?? 'Ok',
        action: config?.action,
        canUseAction: config?.canUseAction ?? true,
        id: dialogId,
        component
      },
      header: '',
      appendTo: 'body',
      ...config,
      closable: false,
      showHeader: false,
      width: '40%',
      height: config?.height,
      breakpoints: {'1440px': '60%','1023px': '70%', '670px': '100%' },
      maximizable: true,
      baseZIndex: 1000000
    });

    if (dialogRef) {
      this._dialogs.set(dialogId, dialogRef);
      if (this._device.isMobile){

        const instance = this._dialog.getInstance(dialogRef);
        instance?.maximize();
      }
    }

    return dialogRef;
  }

  public close(id: string): void {
    const dialog = this._dialogs.get(id);
    if (!dialog) return;

    dialog.destroy();
    this._dialogs.delete(id);
  }
}
