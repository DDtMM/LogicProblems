import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemHostComponent } from './problem-host/problem-host.component';

const routes: Routes = [
  { path: '', component: ProblemHostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
