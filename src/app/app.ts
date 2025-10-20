import {Component, inject, OnInit} from '@angular/core';
import {ThemeService} from './shared/services/theme.service';
import {Title} from '@angular/platform-browser';
import {LoggingService} from './shared/services/logging.service';
import {RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AuthenticationService} from './shared/services/authentication.service';
import {ScreenSizeService} from './shared/services/screen-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly _theme = inject(ThemeService);
  private readonly _title = inject(Title);
  private readonly _authentication = inject(AuthenticationService);
  private readonly _screenSize = inject(ScreenSizeService);

  async ngOnInit(): Promise<void> {
    this._title.setTitle('KernelCash');
    this._theme.init();
    this._authentication.init();
    this._screenSize.init();
  }
}
