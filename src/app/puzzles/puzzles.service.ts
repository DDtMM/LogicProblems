import { Inject, Injectable } from '@angular/core';

import { PuzzleConfigItem, PUZZLES } from './puzzles-config';


@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {
  /** Currenlty hard coded puzzles */
  readonly puzzles: PuzzleConfigItem[];

  constructor(@Inject(PUZZLES) puzzleConfig: PuzzleConfigItem[]) {
    this.puzzles = puzzleConfig;
  }

}
