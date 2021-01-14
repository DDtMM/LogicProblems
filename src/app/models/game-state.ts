import { ProblemCategory } from './problem-category';
import { ProblemDef } from './problem-def';

export type ElemStateValue = 'accept' | 'open' | 'reject';

export interface GameState {
  def: ProblemDef;
  matrices: GameStateMatrix[][];
}

export interface ElemState {
  /** State explicitly set by user. */
  explicitState: ElemStateValue;
  /** The state that should be viewed. */
  visibleState: ElemStateValue;
}
export interface GameStateMatrix {
  catX: ProblemCategory;
  catY: ProblemCategory;
  elems: ElemState[][];
}
