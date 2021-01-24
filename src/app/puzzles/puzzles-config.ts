import { InjectionToken } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import sample1 from '../../data/puzzles/sample1.lp.json';
import sampleSmall from '../../data/puzzles/sampleSmall.lp.json';
/**
 * The desire here is that all the puzzles are loaded as part of the application.
 */
export const puzzleData: ProblemDef[] = [
  sample1,
  sampleSmall
];

export interface PuzzleConfigItem {
  label: string;
  def: ProblemDef;
}

export const PUZZLES = new InjectionToken<PuzzleConfigItem[]>('Puzzle configuration info',
  {
    factory: () => [
      { label: 'Cookies', def: sample1 },
      { label: 'Small', def: sampleSmall }
    ]
  }
);
