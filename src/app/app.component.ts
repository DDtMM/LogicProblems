import { Component, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

import { GameStateService } from './game-state/game-state.service';
import { ThemesService } from './themes/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  readonly themeClass$ = this.themesSvc.currentTheme$.pipe(
    map(x => `theme-${x.key}`)
  );

  constructor(private themesSvc: ThemesService) {}

  ngOnInit() {

  }
}
