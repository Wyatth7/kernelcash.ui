import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs';

export function addJwtInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn):  Observable<HttpEvent<unknown>> {
  const authService = inject(AuthenticationService);

  if (!authService.loggedIn){
    authService.logout();
  }

  const newReq = request.clone({
    headers: request.headers.append('Authorization', `Bearer ${authService.token}`)
  })

  return next(newReq);
}
