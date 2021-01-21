import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProblemGridComponent } from './problem-grid/problem-grid.component';
import { ProblemGridLabelDirective } from './problem-grid/problem-grid-label.directive';
import { ProblemHostComponent } from './problem-host/problem-host.component';
import { ProblemCluesComponent } from './problem-clues/problem-clues.component';
import { ProblemGridRectDirective } from './problem-grid/problem-grid-rect.directive';
import { ThemeSwitcherComponent } from './themes/theme-switcher/theme-switcher.component';
import { FormsModule } from '@angular/forms';
import { PuzzleSelectComponent } from './puzzles/puzzle-select.component';
import { GameMenuComponent } from './game-menu/game-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ProblemGridComponent,
    ProblemGridLabelDirective,
    ProblemHostComponent,
    ProblemCluesComponent,
    ProblemGridRectDirective,
    ThemeSwitcherComponent,
    PuzzleSelectComponent,
    GameMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxLocalStorageModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
