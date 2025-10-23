import {Component, inject, OnInit, signal} from '@angular/core';
import {ThemeService} from './shared/services/theme.service';
import {Title} from '@angular/platform-browser';
import {RouterOutlet} from '@angular/router';
import {AuthenticationService} from './shared/services/authentication.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    ProgressSpinner
  ],
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly _theme = inject(ThemeService);
  private readonly _title = inject(Title);
  private readonly _authentication = inject(AuthenticationService);
  private readonly _screenSize = inject(ScreenSizeService);

  protected readonly appReady = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    this._title.setTitle('KernelCash');
    this._theme.init();
    this._screenSize.init();
    await this._authentication.init();

    this.appReady.set(true);
  }
}
