import { ProblemCategory } from './problem-category';
import { ProblemDef } from './problem-def';

export type ProblemElemState = 'accept' | 'open' | 'reject';

export interface GameState {
  def: ProblemDef;
  matrices: GameStateMatrix[][];
}

export interface GameStateMatrix {
  catX: ProblemCategory;
  catY: ProblemCategory;
  elems: ProblemElemState[][];
}
