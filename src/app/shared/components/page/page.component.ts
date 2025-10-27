import {Component, inject, OnInit} from '@angular/core';
import {PageService} from '../../services/page.service';

@Component({
  selector: 'kc-page',
  template: ''
})
export class PageComponent implements OnInit {
  private readonly _page = inject(PageService);

  protected setPageTitle(title: string): void {
    this._page.pageTitle = title;
  }

  defaultPageTitle?: string;

  ngOnInit() {
      this.setPageTitle(this.defaultPageTitle ?? '');
  }
}
