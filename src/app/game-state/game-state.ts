import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';

export type GameAction = 'init' | 'update';
export type ElemStateValue = 'accept' | 'open' | 'reject';
export type ValidationError = 'dimensionRejected' | 'multipleAccepted';

export interface GameState {
  action: GameAction;
  def: ProblemDef;
  elements: Map<number, ElemState>;
  /** If true then there are errors. */
  hasErrors?: boolean;
  matrices: GameStateMatrix[][];
}

export interface ElemState {
  /** The index of this element in root elements collection. */
  elemId: number;
  /** State explicitly set by user. */
  explicitState: ElemStateValue;
  /** The parent matrix this element belongs to. */
  matrix: GameStateMatrix;
  validationError?: ValidationError;
  /** The state that should be shown. */
  visibleState: ElemStateValue;
  /** the elem xIndex */
  xIdx: number;
  /** the elem yIndex */
  yIdx: number;
}
export interface GameStateMatrix {
  catX: ProblemCategory;
  catY: ProblemCategory;
  elems: ElemState[][];
  /** the matrix xIndex */
  xIdx: number;
  /** the matrix yIndex */
  yIdx: number;
}
