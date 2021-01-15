import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';

export type ElemStateValue = 'accept' | 'open' | 'reject';

export interface GameState {
  def: ProblemDef;
  elements: Map<number, ElemState>;
  matrices: GameStateMatrix[][];
}

export interface ElemState {
  /** The index of this element in root elements collection. */
  elemId: number;
  /** State explicitly set by user. */
  explicitState: ElemStateValue;
  /** The parent matrix this element belongs to. */
  matrix: GameStateMatrix;
  /** The state that should be shown. */
  visibleState: ElemStateValue;
  /** the matrix xIndex */
  xIdx: number;
  /** the matrix yIndex */
  yIdx: number;
}
export interface GameStateMatrix {
  catX: ProblemCategory;
  catY: ProblemCategory;
  elems: ElemState[][];
}
