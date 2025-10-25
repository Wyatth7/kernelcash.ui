import {Component, inject, output} from '@angular/core';
import {Button, ButtonDirective, ButtonIcon} from 'primeng/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Menu} from 'primeng/menu';
import {MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {Avatar} from 'primeng/avatar';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'kc-side-nav',
  imports: [
    Button,
    RouterLink,
    Menu,
    Avatar,
  ],
  templateUrl: 'side-nav.component.html'
})
export class SideNavComponent {
  private readonly _authentication = inject(AuthenticationService);

  protected get currentUserNameFull(): string {
    return `${this._authentication.currentUser.nameFirst} ${this._authentication.currentUser.nameLast}`;
  }

  public readonly closeNav = output<void>();

  protected userMenuItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: async (event: MenuItemCommandEvent) => {
        this._authentication.logout();
      }
    }
  ]

}
