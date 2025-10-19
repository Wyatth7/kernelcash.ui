import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LoggingService {
  public info(value: unknown): void {
    console.info(value);
  }

  public warn(value: unknown): void {
    console.warn(value);
  }

  public error(value: unknown): void {
    console.error(value);
  }

  public debug(value:unknown): void {
    if (environment.production)
      return;

    console.debug(value);
  }
}
