import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Fluid} from 'primeng/fluid';

@Component({
  selector: 'kc-form-control',
  imports: [
    ReactiveFormsModule,
    InputText,
    Fluid
  ],
  templateUrl: 'form-control.component.html'
})
export class FormControlComponent {
  public readonly control = input<FormControl<unknown>>();
  public readonly placeholder = input<string>('');
  public readonly isValid = input<boolean>(true);

  public readonly label = input.required<string>();

  protected readonly controlId = crypto.randomUUID();
}
