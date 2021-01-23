import { IdType } from '../models/id-type';
import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';

export type GameAction = 'init' | 'update';
export type ElemStateValue = 'accept' | 'open' | 'reject';
export type ValidationError = 'dimensionRejected' | 'multipleAccepted';

export interface GameStateHistoryItem {
  currentState: ElemStateValue;
  elemId: number;
  priorState: ElemStateValue;
}

export interface SavedGame {
  /** number of elapsed milliseconds. */
  elapsedMs: number;
  history: GameStateHistoryItem[];
  puzzleId: number;
}

export interface SavedGames {
  [key: number]: SavedGame;
}

export interface GameState {
  /** The last action. */
  action: GameAction;
  def: ProblemDef;
  elements: Map<number, ElemState>;
  /** If true then there are errors. */
  hasErrors?: boolean;
  history: GameStateHistoryItem[];
  matrices: GameStateMatrix[][];
  /** If restored, how much time has elapsed. */
  priorElapsedMs: number;
  puzzleId: number;
  /** The time the game session began. */
  sessionStart: Date;
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
