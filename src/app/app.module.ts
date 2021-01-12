import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProblemGridComponent } from './problem-grid/problem-grid.component';
import { ProblemGridLabelDirective } from './problem-grid/problem-grid-label.directive';
import { ProblemHostComponent } from './problem-host/problem-host.component';
import { ProblemCluesComponent } from './problem-clues/problem-clues.component';
import { ProblemGridRectDirective } from './problem-grid/problem-grid-rect.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProblemGridComponent,
    ProblemGridLabelDirective,
    ProblemHostComponent,
    ProblemCluesComponent,
    ProblemGridRectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
