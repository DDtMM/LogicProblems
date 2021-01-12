import { ProblemCategory } from '../models/problem-category';
import { ProblemItem } from '../models/problem-item';

export type ProblemGridElemVmState = 'accept' | 'open' | 'reject';

export interface ProblemGridElemVm {
  /** The associated category item along the x axis. */
  itemX: ProblemItem;
  /** The associated category item along the y axis. */
  itemY: ProblemItem;
  /** The current visual state of the element. */
  state: ProblemGridElemVmState;
}

export interface ProblemCategoryVm extends ProblemCategory {
  /** The index in which this category appears. */
  index: number;
  /** Is the first item in its parent collection. */
  isFirst: boolean;
  /** Is the last item in its parent collection. */
  isLast: boolean;
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
  /** 2d array of CategoryMatrix. */
  matrices: ProblemGridVmCategoryMatrix[][];
  /** All possible x-axis categories. */
  xCats: ProblemCategoryVm[];
  /** All possible y-axis categories. */
  yCats: ProblemCategoryVm[];
}
