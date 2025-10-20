import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {SideNavComponent} from './side-nav/side-nav.component';
import {RouterOutlet} from '@angular/router';
import {ScreenSizeService} from '../shared/services/screen-size.service';
import {AsyncPipe} from '@angular/common';
import {Button, ButtonDirective} from 'primeng/button';
import {Subscription} from 'rxjs';

@Component({
  selector: 'kc-core',
  imports: [
    SideNavComponent,
    RouterOutlet,
    Button,
    ButtonDirective
  ],
  templateUrl: 'core.component.html'
})
export class CoreComponent implements OnInit, OnDestroy {
  private readonly _screenSize = inject(ScreenSizeService);

  private _screenSizeSubscription!: Subscription;

  protected readonly isMobile = signal<boolean>(false);

  ngOnInit(): void {
    this._screenSizeSubscription = this._screenSize.isMobile$.subscribe(
      x => this.isMobile.set(x)
    );
  }

  ngOnDestroy(): void {
    this._screenSizeSubscription.unsubscribe();
  }
}
