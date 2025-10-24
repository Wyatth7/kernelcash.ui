import {Component, inject, OnInit} from '@angular/core';
import {PageService} from '../../services/page.service';

@Component({
  selector: 'kc-page',
  template: ''
})
export class PageComponent implements OnInit {
  private readonly _page = inject(PageService);

  pageTitle?: string;

  ngOnInit() {
      this._page.pageTitle = this.pageTitle ?? ''
  }
}
