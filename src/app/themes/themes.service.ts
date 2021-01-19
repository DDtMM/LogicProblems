import { Inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, defer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { THEMES } from './themes-config';

export interface ThemeInfo {
  key: string;
  label: string;
}
@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  // key for caching storing theme value in storage.
  private static currentThemeKey = 'ThemesService_theme';

  /** The currently selected theme. */
  readonly currentTheme$ = defer(() => this.currentThemeSubject.asObservable()).pipe(shareReplay(1));

  /** All possible themes, sorted by label. */
  readonly themes: ThemeInfo[];

  private readonly currentThemeSubject;

  constructor(private storageSvc: LocalStorageService, @Inject(THEMES) themes: ThemeInfo[]) {
    const defaultTheme = themes[0];
    this.themes = themes.sort((a, b) => a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1);
    this.currentThemeSubject = new BehaviorSubject<ThemeInfo>(
      this.getTheme(storageSvc.get(ThemesService.currentThemeKey)) || defaultTheme);
  }

  /** Gets theme by key, returns undefined if no match is found. */
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
