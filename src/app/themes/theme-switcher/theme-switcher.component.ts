import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemesService } from '../themes.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styles: [
  ]
})
export class ThemeSwitcherComponent {

  readonly currentTheme$ = this.themesSvc.currentTheme$;

  get themes() { return this.themesSvc.themes; }

  constructor(private themesSvc: ThemesService) { }

  setTheme(key: string) {
    this.themesSvc.setTheme(key);
  }

}
