import { Component, OnInit } from '@angular/core';
import { PuzzlesService } from './puzzles.service';

@Component({
  selector: 'app-puzzle-select',
  templateUrl: './puzzle-select.component.html',
  styles: [
  ]
})
export class PuzzleSelectComponent implements OnInit {

  readonly puzzles = this.puzzleSvc.puzzles;

  constructor(private puzzleSvc: PuzzlesService) { }

  ngOnInit(): void {
  }

}
