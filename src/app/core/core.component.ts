import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {SideNavComponent} from './side-nav/side-nav.component';
import {RouterOutlet} from '@angular/router';
import {ScreenSizeService} from '../shared/services/screen-size.service';
import {AsyncPipe} from '@angular/common';
import {Button, ButtonDirective} from 'primeng/button';
import {Subscription} from 'rxjs';
import {Drawer} from 'primeng/drawer';
import {PageService} from '../shared/services/page.service';

@Component({
  selector: 'kc-core',
  imports: [
    SideNavComponent,
    RouterOutlet,
    Drawer
  ],
  templateUrl: 'core.component.html'
})
export class CoreComponent implements OnInit, OnDestroy {
  private readonly _screenSize = inject(ScreenSizeService);
  private readonly _page = inject(PageService);

  private _screenSizeSubscription!: Subscription;
  private _pageTitleSubscription!: Subscription;

  protected readonly isMobile = signal<boolean>(false);
  protected showDrawer: boolean = false;
  protected readonly pageTitle = signal<string>('');

  ngOnInit(): void {
    this._screenSizeSubscription = this._screenSize.isMobile$.subscribe(
      x => this.isMobile.set(x)
    );

    this._pageTitleSubscription = this._page.pageTitle$.subscribe(title => this.pageTitle.set(title));
  }

  ngOnDestroy(): void {
    this._pageTitleSubscription.unsubscribe();
    this._screenSizeSubscription.unsubscribe();
  }
}
