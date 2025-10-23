import {Component, computed, input, output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'kc-icon-step',
  imports: [
    NgClass
  ],
  templateUrl: 'icon-step.component.html'
})
export class IconStepComponent {
  public readonly activated = output<void>();

  public readonly icon = input.required<string>();
  public readonly activeStep = input.required<number>();
  public readonly value = input.required<number>();

  public readonly iconClass = computed<string>(() => `pi ${this.icon()}`);
}
