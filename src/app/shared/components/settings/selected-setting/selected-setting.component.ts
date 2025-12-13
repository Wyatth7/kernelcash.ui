import {Component, input, output, signal} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-selected-setting',
  imports: [
    Button,
  ],
  templateUrl: 'selected-setting.component.html'
})
export class SelectedSettingComponent {
  public readonly title = input.required<string>();
  public readonly allowEditing = input(true);
  public readonly action = input<() => Promise<void>>();
  public readonly disabled = input<boolean>(false);

  public readonly onClose = output<void>();
  public readonly onSave = output<void>();

  protected readonly isSaving = signal<boolean>(false);
  protected readonly isEditing = signal<boolean>(false);

  protected cancelEditing(): void {
    this.isEditing.set(false);
    this.onClose.emit();
  }

  protected async save(): Promise<void> {
    try {
      this.isSaving.set(true);
      this.onSave.emit();
      await this.action()?.();
      this.isEditing.set(false);
    }
    catch (e) {
      throw e;
    }

    this.isSaving.set(false);
  }
}
