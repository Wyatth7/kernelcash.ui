import {Component, computed, input} from '@angular/core';
import {CurrencyPipe, NgClass} from '@angular/common';

type Severity = 'success' | 'danger' | 'info';

@Component({
  selector: 'kc-total-text',
  imports: [
    CurrencyPipe,
    NgClass
  ],
  template: `
    <div [ngClass]="{'flex-row': !column()}" class="flex items-end gap-1">
      <h3 [ngClass]="textColor()" class="text-xl">{{ total() | currency }}</h3>
      <p  class="m-0 p-0 text-gray-400 text-right">{{ text() }}</p>
    </div>
  `
})
export class TotalTextComponent {
  public readonly total = input.required<number>();
  public readonly text = input.required<string>();
  public readonly column = input<boolean>(true);

  public readonly severity = input<Severity>();

  protected readonly textColor = computed<string>(() => {
    if (this.total() < 0 && !this.severity())
      return 'text-emerald-400';

    switch (this.severity()) {
      case "success":
        return 'text-emerald-400';
      case "info":
        return 'text-blue-300'
      case "danger":
        return 'text-red-400'
      default:
        return "text-emerald-400";
    }
  })
}
