import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {LoggingService} from './logging.service';
import {User} from '../models/users/user';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private readonly _logger = inject(LoggingService);
  private readonly _userService = inject(UserService);

  private _user!: User;

  public get loggedIn(): boolean {
    return !!this.token;
  }

  public get currentUser(): User {
    if (!this._user)
      this.logout();

    return this._user;
  }

  public get token(): string {
    const AUTH_NAME = 'CF_Authorization=';
    const cookies = document.cookie.split(';');
    const token = cookies.find(cookie => cookie.startsWith(AUTH_NAME))?.split(AUTH_NAME)[1];

    if (!token) {
      this.logout();
      return '';
    }
    return token;
  }

  /**
   * Attempts to initiate the session.
   *
   * Checks to see if the user token exists,
   */
  public async init(): Promise<void> {
    if (!this.token) {
      this.unauthorized();
      return;
    }

    this._user = await this._userService.getCurrentUser();
  }

  /**
   * Invalidates the current user's token, and sends them back to the
   * Cloudflare Zero Trust login page.
   */
  public logout(): void {
    globalThis.location.href = environment.logoutUrl;
  }

  /**
   * Sets all credentials to empty, and refreshes the page.
   *
   * This acts as sending the user back to the login page,
   * and will force the user back the cloudflare Zero Trust login page.
   */
  public unauthorized(): void {
    this.logout();
  }
}
