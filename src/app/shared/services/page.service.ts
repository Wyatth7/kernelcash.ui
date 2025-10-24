import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly _pageTitleSubject = new Subject<string>();

  public get pageTitle$(): Observable<string> {
    return this._pageTitleSubject.asObservable();
  }

  public set pageTitle(value: string) {
    this._pageTitleSubject.next(value);
  }
}
