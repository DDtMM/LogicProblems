import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import data from '../samples/sample1.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-host',
  templateUrl: './problem-host.component.html',
  styleUrls: ['./problem-host.component.scss']
})
export class ProblemHostComponent implements OnInit {

  problem: ProblemDef = data;

  constructor() { }

  ngOnInit(): void {
    console.log(this.problem);
  }

}
