import {Component, inject, OnInit, signal} from '@angular/core';
import {ThemeService} from './shared/services/theme.service';
import {Title} from '@angular/platform-browser';
import {RouterOutlet} from '@angular/router';
import {AuthenticationService} from './shared/services/authentication.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {SpinnerComponent} from './shared/components/spinner/spinner.component';
import {DeviceService} from './shared/services/device.service';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    SpinnerComponent
  ],
  providers: [DialogService],
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly _theme = inject(ThemeService);
  private readonly _title = inject(Title);
  private readonly _authentication = inject(AuthenticationService);
  private readonly _screenSize = inject(ScreenSizeService);
  private readonly _device = inject(DeviceService);

  protected readonly appReady = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    this._title.setTitle('KernelCash');
    this._theme.init();
    this._screenSize.init();
    this._device.detect();
    await this._authentication.init();

    this.appReady.set(true);
  }
}
