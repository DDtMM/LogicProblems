import { ElemStateValue } from '../models/game-state';
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

export interface ProblemGridElemVm {
  /** The location and size of the grid item */
  gridRect: Rect;
  /** The associated category item along the x axis. */
  itemX: ProblemItem;
  /** The associated category item along the y axis. */
  itemY: ProblemItem;
  /** The current visual state of the element. */
  state: ElemStateValue;
}

export interface ProblemItemVm extends ProblemItem {
  labelRect: Rect;
  isLabelVert: boolean;
}
export interface ProblemCategoryVm extends ProblemCategory {
  labelRect: Rect;
  isLabelVert: boolean;
  items: ProblemItemVm[];
  /** The index in which this category appears. */
  index: number;
  /** What it the total count of items that occur before this category. */
  itemOffset: number;
}

export interface ProblemGridVmCategoryMatrix {
  /** The category along the x axis represented by this matrix. */
  catX: ProblemCategoryVm;
  /** The category along the y axis represented by this matrix. */
  catY: ProblemCategoryVm;
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
