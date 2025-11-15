import {Injectable, TemplateRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly _pageTitleSubject = new Subject<string>();
  private readonly _pageTemplate = new Subject<TemplateRef<unknown> | undefined>();

  public get pageTitle$(): Observable<string> {
    return this._pageTitleSubject.asObservable();
  }

  public get pageTemplate$(): Observable<TemplateRef<unknown> | undefined> {
    return this._pageTemplate.asObservable();
  }

  public set pageTemplate(template: TemplateRef<unknown> | undefined) {
    this._pageTemplate.next(template);
  }

  public set pageTitle(value: string) {
    this._pageTitleSubject.next(value);
  }
}
