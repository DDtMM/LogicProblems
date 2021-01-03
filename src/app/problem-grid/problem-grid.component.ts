import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProblemDef } from '../models/problem-def';
import { problemDefToGridVm } from './problem-def-to-grid-vm';
import { ProblemGridVm } from './problem-grid-vm';

@Component({
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.html',
  styles: [
  ]
})
export class ProblemGridComponent implements OnInit {

  gridVm?: ProblemGridVm;

  @Input()
  set problem(value: ProblemDef | undefined) {
    this.gridVm = value ? problemDefToGridVm(value) : undefined;
  }

  constructor() { }

  ngOnInit(): void {
  }

  private ProblemDefToVm(def: ProblemDef) {

  }
}
