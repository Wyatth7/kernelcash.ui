import {Component, inject, signal} from '@angular/core';
import {SettingsComponent, SettingsOptions} from '../settings/settings.component';
import {AuthenticationService} from '../../services/authentication.service';
import {UserEditorComponent} from './user-editor/user-editor.component';
import {PaymentsComponent} from "./payments/payments.component";

@Component({
  selector: 'kc-user-settings',
  imports: [
    SettingsComponent
  ],
  templateUrl: 'user-settings.component.html'
})
export class UserSettingsComponent {
  private readonly _auth = inject(AuthenticationService);

  protected readonly settings = signal<SettingsOptions[]>([
    {
      title: 'Settings',
      settings: [
        {
          label: 'My Account',
          component: UserEditorComponent
        },
        {
          label: 'Payments',
          component: PaymentsComponent
        }
      ]
    },
    {
      title: 'Other',
      settings: [
        {
          label: 'Logout',
          action: this._auth.logout,
          icon: 'pi pi-sign-out'

        }
      ]
    }
  ]).asReadonly()
}
