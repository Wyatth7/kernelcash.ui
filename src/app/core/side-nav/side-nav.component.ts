import {Component, inject, output} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {Avatar} from 'primeng/avatar';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {CustomDialogService} from '../../shared/services/custom-dialog.service';
import {UserSettingsComponent} from '../../shared/components/user-settings/user-settings.component';

@Component({
  selector: 'kc-side-nav',
  imports: [
    Button,
    RouterLink,
    Avatar,
  ],
  templateUrl: 'side-nav.component.html'
})
export class SideNavComponent {
  private readonly _authentication = inject(AuthenticationService);
  private readonly _dialog = inject(CustomDialogService);

  protected get currentUserNameFull(): string {
    return `${this._authentication.currentUser.nameFirst} ${this._authentication.currentUser.nameLast}`;
  }

  public readonly closeNav = output<void>();

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
