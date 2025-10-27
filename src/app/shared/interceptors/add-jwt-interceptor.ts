import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs';
import {LoggingService} from '../services/logging.service';

export function addJwtInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn):  Observable<HttpEvent<unknown>> {
  const authService = inject(AuthenticationService);
  const logger = inject(LoggingService);

  if (!authService.loggedIn){
    logger.info('JWT INTERCEPTOR: User is not logged in, or the token is expired.');
    authService.logout();
  }

  const newReq = request.clone({
    headers: request.headers.append('Authorization', `Bearer ${authService.token}`)
  })

  return next(newReq);
}
