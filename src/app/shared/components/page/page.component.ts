import {AfterViewInit, Component, inject, OnInit, TemplateRef, viewChild} from '@angular/core';
import {PageService} from '../../services/page.service';

@Component({
  selector: 'kc-page',
  template: ''
})
export class PageComponent implements OnInit, AfterViewInit {
  private readonly _page = inject(PageService);

  protected readonly pageTemplate = viewChild<TemplateRef<unknown>>('pageTemplate');

  protected setPageTitle(title: string): void {
    this._page.pageTitle = title;
  }

  defaultPageTitle?: string;

  ngOnInit() {
      this.setPageTitle(this.defaultPageTitle ?? '');
  }

  ngAfterViewInit() {
    this._page.pageTemplate = this.pageTemplate();
  }
}
