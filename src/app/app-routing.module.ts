import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemHostComponent } from './problem-host/problem-host.component';
import { PuzzleSelectComponent } from './puzzles/puzzle-select.component';
import { PuzzleGuard } from './puzzles/puzzle.guard';

const routes: Routes = [
  { path: '', component: PuzzleSelectComponent },
  { path: 'puzzles/:puzzleIdx', component: ProblemHostComponent, canActivate: [ PuzzleGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
