import {Component, input} from '@angular/core';
import {ProgressSpinner} from 'primeng/progressspinner';
import {NgClass} from '@angular/common';

@Component({
  selector: 'kc-spinner',
  imports: [
    ProgressSpinner,
    NgClass
  ],
  template: `
    <div class="w-full h-full relative">
      <div
        [ngClass]="{
            'absolute left-0 right-0 top-0 bottom-0 h-vh h-dvh': fullScreen(),
            'h-full': !fullScreen()
        }"
      >
        <div class="flex justify-center items-center flex-col h-full">
          <p-progressSpinner/>
          @if (!hideLabel()) {
              <h1 class="text-gray-500">{{ label() }}</h1>
          }
        </div>
      </div>
    </div>
  `
})
export class SpinnerComponent {
  public readonly fullScreen = input<boolean>(true);
  public readonly label = input<string>('Loading, please wait...');
  public readonly hideLabel = input<boolean>(false);

}
