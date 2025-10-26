import {Component, computed, input, output} from '@angular/core';
import {Card} from 'primeng/card';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Button} from 'primeng/button';

@Component({
  selector: 'kc-data-card',
  imports: [
    Card,
    ProgressSpinner,
    Button
  ],
  templateUrl: 'data-card.html'
})
export class DataCard {
  public readonly title = input<string>();
  public readonly icon = input<string>();
  public readonly shouldLoad = input<boolean>();
  public readonly customAction = input<boolean>();
  public readonly actionLabel = input<string>();

  public readonly actionClicked = output<void>();

  public readonly iconClass = computed<string>(() => `pi ${this.icon()}`);
}
