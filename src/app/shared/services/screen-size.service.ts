import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({providedIn: 'root'})
export class ScreenSizeService implements OnDestroy {
  private readonly _breakpointObserver = inject(BreakpointObserver);

  private _screenSizeSubscription!: Subscription;
  private _isMobile = new BehaviorSubject<boolean>(window.innerWidth > 767);

  public get isMobile$(): Observable<boolean> {
    return this._isMobile.asObservable();
  }

  public init(): void {
    this._screenSizeSubscription = this._breakpointObserver
      .observe('(max-width: 767px)')
      .subscribe(x => this._isMobile.next(!x.matches));
  }

  ngOnDestroy() {
    this._screenSizeSubscription.unsubscribe();
  }

}
