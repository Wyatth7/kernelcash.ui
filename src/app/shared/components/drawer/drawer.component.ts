import {Component, input, model, OnChanges, output} from '@angular/core';
import {BudgetCreateFormComponent} from '../budgets/budget-form/budget-create-form/budget-create-form.component';
import {Drawer} from 'primeng/drawer';

@Component({
  selector: 'kc-drawer',
  imports: [
    Drawer
  ],
  template: `

    <p-drawer
      [(visible)]="visible"
      position="right"
      styleClass="!w-full  md:!w-[30rem]">
      <ng-content></ng-content>
    </p-drawer>

  `
})
export class DrawerComponent implements OnChanges {
  // public readonly showDrawer = input.required<boolean>();
  public readonly closed = output<void>();

  public readonly visible = model(false)

  // protected _visible: boolean = false;
  //
  // protected set visible(visible: boolean) {
  //   this._visible = visible;
  //
  //   if (!visible)
  //     this.closed.emit();
  // }
  //
  // protected get visible(): boolean {
  //   return this._visible;
  // }

  ngOnChanges(): void {
    // this.visible = this.showDrawer();
  }
}
