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

  public readonly onClose = output<void>();
  public readonly onSave = output<void>();

  protected readonly isEditing = signal<boolean>(false);

  protected cancelEditing(): void {
    this.isEditing.set(false);
    this.onClose.emit();
  }
}
