import {Component, computed, inject, input, OnInit, Renderer2, signal, Type} from '@angular/core';
import {NgClass, NgComponentOutlet} from '@angular/common';
import {Button} from 'primeng/button';

export type SettingsOptions = {
  title?: string;
  settings: SettingsOption[];
}

export type SettingsOption = {
  label: string;
  icon?: string;
  component?: Type<any> | null;
  action?: () => void;
  id?: string;
}

@Component({
  selector: 'kc-settings',
  imports: [
    Button,
    NgComponentOutlet
  ],
  templateUrl: 'settings.component.html'
})
export class SettingsComponent implements OnInit {
  private readonly _renderer2 = inject(Renderer2);
  public readonly settings = input.required<SettingsOptions[]>();

  protected activeComponent = signal<Type<any> | null>(null);
  private _previousActiveTarget: HTMLElement | null = null;

  ngOnInit(): void {
    for (let settingOptionsIndex = 0; settingOptionsIndex < this.settings().length; settingOptionsIndex++) {
      const option = this.settings()[settingOptionsIndex];
      for (let settingIndex = 0; settingIndex < option.settings.length; settingIndex++) {
        const setting = option.settings[settingIndex];

        if (!setting.id) {
          setting.id = crypto.randomUUID();
        }

        if (setting.component) {
          this.activeComponent.set(setting.component);
          return;
        }
      }
    }
  }

  protected settingClicked(setting: SettingsOption): void {
    if (setting.component) {
      this.activeComponent.set(setting.component);
    }

    setting.action?.();
  }
}
