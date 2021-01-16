import { ElemStateValue, ValidationError } from '../game-state/game-state';
import { ProblemCategory } from '../models/problem-category';
import { ProblemItem } from '../models/problem-item';

export interface Point2d {
  x: number;
  y: number;
}

export interface Rect extends Point2d {
  height: number;
  width: number;
}

/** The base of an item or category */
export interface ProblemAttributeVm {
  labelRect: Rect;
  isLabelVert: boolean;
}

export interface ProblemGridElemVm {
  /** The id of the associated game element */
  elemId: number;
  error?: ValidationError;
  /** The location and size of the grid item */
  gridRect: Rect;
  /** The current visual state of the element. */
  state: ElemStateValue;
}

export type ProblemItemVm = ProblemItem & ProblemAttributeVm;

export interface ProblemCategoryVm extends ProblemCategory, ProblemAttributeVm {
  items: ProblemItemVm[];
  /** The index in which this category appears. */
  index: number;
}

export interface ProblemGridVmCategoryMatrix {
  /** The category along the x axis represented by this matrix. */
  catXIdx: number;
  /** The category along the y axis represented by this matrix. */
  catYIdx: number;
  /** All elements. */
  elems: ProblemGridElemVm[][];
}

export interface ProblemGridVm {
  /** The size of a grid block */
  baseUnit: number;
  /** The number of grid blocks an item label takes up. */
  itemLabelMultiplier: number;
  /** 2d array of CategoryMatrix. */
  matrices: ProblemGridVmCategoryMatrix[][];
  /** The total width and height of the grid. */
  totalLength: number;
  /** Rectangles that encompass the total area of a category. */
  tracks: Rect[];
  /** All possible x-axis categories. */
  xCats: ProblemCategoryVm[];
  /** All possible y-axis categories. */
  yCats: ProblemCategoryVm[];
}
