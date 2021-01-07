import { Component, OnInit } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import data from '../samples/sample1.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  problem: ProblemDef = data;

  constructor() { }

  ngOnInit(): void {
    console.log(this.problem);
  }

}
