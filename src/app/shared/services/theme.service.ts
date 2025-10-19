import {Injectable} from '@angular/core';

export type ThemeType = 'light' | 'dark';

const SYS_DARK_MODE_TOKEN = '(prefers-color-scheme: dark)';
const DARK_MODE_CLASSNAME = 'app-dark'

@Injectable({providedIn: 'root'})
export class ThemeService {
  private _theme: ThemeType = 'dark';

  /**
   * Inits the theme service events.
   */
  public init(): void {
    console.log(this.userDarkModePreference)
    this.setTheme(this.userDarkModePreference);
    this.listenForEvents();
  }

  public setTheme(theme: ThemeType): void {
    const root = document.getElementById('root')?.classList
    if (!root) return;

    if (this.isDarkMode(theme) && this.isDarkMode() && root.contains(DARK_MODE_CLASSNAME))
      return;

    if (!this.isDarkMode(theme)) {
      root.remove(DARK_MODE_CLASSNAME);
    } else {
      root.add(DARK_MODE_CLASSNAME);
    }

    this._theme = theme;
  }

  public get userDarkModePreference(): ThemeType {
    const isDark = window.matchMedia(SYS_DARK_MODE_TOKEN).matches;

    return isDark ? 'dark' : 'light';
  }

  public isDarkMode(value?: ThemeType): boolean {
    value ??= this._theme;

    return value === 'dark';
  }

  private listenForEvents(): void {
    window.matchMedia(SYS_DARK_MODE_TOKEN).addEventListener('change', event => {
      const isDark: ThemeType = event.matches ? 'dark' : 'light';
      this.setTheme(isDark);
    })
  }
}
