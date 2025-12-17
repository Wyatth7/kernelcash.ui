import {Component, inject, OnDestroy, OnInit, output, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {Avatar} from 'primeng/avatar';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {CustomDialogService} from '../../shared/services/custom-dialog.service';
import {UserSettingsComponent} from '../../shared/components/user-settings/user-settings.component';
import {User} from '../../shared/models/users/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'kc-side-nav',
  imports: [
    Button,
    RouterLink,
    Avatar,
  ],
  templateUrl: 'side-nav.component.html'
})
export class SideNavComponent implements OnInit, OnDestroy {
  private readonly _authentication = inject(AuthenticationService);
  private readonly _dialog = inject(CustomDialogService);

  private _currentUserNameFullSubscription!: Subscription;

  protected readonly currentUserNameFull = signal<string>(this._authentication.getCurrentUser().nameFull);

  public readonly closeNav = output<void>();

  ngOnInit(): void {
    this._currentUserNameFullSubscription = this._authentication.getCurrentUser$()
      .subscribe(user => this.currentUserNameFull.set(user.nameFull));
  }

  ngOnDestroy(): void {
    this._currentUserNameFullSubscription.unsubscribe();
  }

  protected openUserSettings(): void {
    this._dialog.show(UserSettingsComponent, {
      showAction: false,
      showCancel: false,
      title: 'Settings',
      message: 'View or modify your account settings.',
    });
    this.closeNav.emit();
  }

}
