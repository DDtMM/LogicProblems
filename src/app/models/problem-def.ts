import { ProblemCategory } from './problem-category';
import { ProblemClue } from './problem-clue';

export interface ProblemDef {
  categories: ProblemCategory[];
  clues: ProblemClue[];
}

