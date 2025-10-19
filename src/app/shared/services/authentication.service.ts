import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LoggingService} from './logging.service';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private readonly _logger = inject(LoggingService);

  public get loggedIn(): boolean {
    return !!this.token;
  }

  public get token(): string {
    const AUTH_NAME = 'CF_Authorization=';
    const cookies = document.cookie.split(';');
    const token = cookies.find(cookie => cookie.startsWith(AUTH_NAME))?.split(AUTH_NAME)[1];

    return token ?? '';
  }

  /**
   * Attempts to initiate the session.
   *
   * Checks to see if the user token exists,
   */
  public init(): void {
    if (!this.token) {
      this.unauthorized();
      return;
    }
  }

  /**
   * Invalidates the current user's token, and sends them back to the
   * Cloudflare Zero Trust login page.
   */
  public logout(): void {
    this._logger.info('Logging out user, and redirecting to login.');

    globalThis.location.href = environment.logoutUrl;
  }

  /**
   * Sets all credentials to empty, and refreshes the page.
   *
   * This acts as sending the user back to the login page,
   * and will force the user back the cloudflare Zero Trust login page.
   */
  public unauthorized(): void {
    globalThis.location.reload();
  }
}
