import {Component, computed, input} from '@angular/core';
import {CurrencyPipe, NgClass} from '@angular/common';

type Severity = 'success' | 'danger' | 'info';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'kc-total-text',
  imports: [
    CurrencyPipe,
    NgClass
  ],
  template: `
    <div [ngClass]="{
    'flex-row': !column(),
    'flex-col': column()

    }" class="flex items-end gap-1">
      <h3 [class]="valueTextStyle()">{{ total() | currency }}</h3>
      <p  [ngClass]="textSize().text" class="m-0 p-0 text-gray-400 text-right">{{ text() }}</p>
    </div>
  `
})
export class TotalTextComponent {
  public readonly total = input.required<number>();
  public readonly text = input.required<string>();

  public readonly column = input<boolean>(true);
  public readonly size = input<Size>('lg');
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

  protected readonly textSize = computed<{total: string, text: string}>(() => {
    switch (this.size()) {
      case "xs":
        return {total: 'text-md', text: 'text-xs'};
      case 'md':
        return {total: 'text-lg', text: 'text-sm'};
      case "lg":
        return {total: 'text-xl', text: 'text-md'};
      case 'xl':
        return {total: 'text-2xl', text: 'text-lg'};
      default:
        return {total: 'text-xl', text: 'text-md'};
    }
  });

  protected readonly valueTextStyle = computed(() => `${this.textSize().total} ${this.textColor()}`);
}
