import { Component, Input } from '@angular/core';
import { ProblemClue } from '../models/problem-clue';

@Component({
  selector: 'app-problem-clues',
  templateUrl: './problem-clues.component.html'
})
export class ProblemCluesComponent {
  @Input()
  clues?: ProblemClue[];
}
