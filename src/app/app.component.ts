import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { ThemesService } from './themes/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  readonly themeClass$ = this.themesSvc.currentTheme$.pipe(
    map(x => `theme-${x.key}`)
  );

  constructor(private themesSvc: ThemesService) {}
}
