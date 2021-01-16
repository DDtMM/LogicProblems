import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, defer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface ThemeInfo {
  key: string;
  label: string;
}
@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  private static currentThemeKey = 'ThemesService_theme';
  /** The currently selected theme. */
  readonly currentTheme$ = defer(() => this.currentThemeSubject.asObservable()).pipe(shareReplay(1));

  /** All possible themes. */
  readonly themes = [
    { key: 'blueBerry', label: 'Blueberry' },
    { key: 'bw', label: 'Black & White' },
    { key: 'highContrast', label: 'High Contrast' },
    { key: 'sunset', label: 'Sunset' }
  ];

  private readonly currentThemeSubject;

  constructor(private storageSvc: LocalStorageService) {
    this.currentThemeSubject = new BehaviorSubject<ThemeInfo>(
      this.getTheme(storageSvc.get(ThemesService.currentThemeKey)) || this.themes[0]);
  }

  getTheme(key: string) {
    return this.themes.find(x => x.key === key);
  }

  /** Sets the current theme if matching key or themeInfo object is found in themes collection. */
  setTheme(themeOrKey: string | ThemeInfo) {
    const theme = this.themes.find(x => x === themeOrKey || x.key === themeOrKey);
    if (theme) {
      this.storageSvc.set(ThemesService.currentThemeKey, themeOrKey);
      this.currentThemeSubject.next(theme);
    }
  }
}
