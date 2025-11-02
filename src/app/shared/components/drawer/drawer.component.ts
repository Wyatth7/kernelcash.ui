import {Component, input, model, OnChanges, output, signal} from '@angular/core';
import {Drawer} from 'primeng/drawer';

@Component({
  selector: 'kc-drawer',
  imports: [
    Drawer
  ],
  template: `
    @if (visible()) {
      <p-drawer
        (onHide)="killContent.set(true); killContent.set(false)"
        [(visible)]="visible"
        position="right"
        styleClass="!w-full  md:!w-[30rem]">
        @if (!killContent()) {
            <ng-content></ng-content>
        }
      </p-drawer>
    }
  `
})
export class DrawerComponent {
  public readonly closed = output<void>();

  public readonly visible = model(false)

  public readonly killContent = signal<boolean>(false)
}
