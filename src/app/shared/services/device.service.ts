import {inject, Injectable} from '@angular/core';
import DeviceDetector from 'device-detector-js';
import {DeviceType} from 'device-detector-js/dist/typings/device';
import {LoggingService} from './logging.service';

@Injectable({providedIn: 'root'})
export class DeviceService {
  private readonly _logger = inject(LoggingService);

  private _deviceType: DeviceType = '';

  get deviceType(): DeviceType {
    return this._deviceType;
  }

  get isMobile(): boolean {
    return this.deviceType === 'smartphone' || this.deviceType === 'tablet';
  }

  get isDesktop(): boolean {
    return this.deviceType === 'desktop';
  }

  public detect(): void {
    const detector = new DeviceDetector();
    const device = detector.parse(navigator.userAgent);
    if (!device.device) {
      this._logger.error("Failed to determine device type.")
      return;
    }

    this._deviceType = device.device.type;
  }

}
