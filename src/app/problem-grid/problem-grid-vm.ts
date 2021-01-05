import { IdType } from "../models/id-type";
import { ProblemCategory } from "../models/problem-category";
import { ProblemGridItemVm } from "../problem-grid-item/problem-grid-item-vm";

export interface ProblemGridVmCategoryMatrix {
  catX: ProblemCategory;
  catY: ProblemCategory;
  itemMatrix: ProblemGridItemVm[][];
}

export interface ProblemGridVm {
  categoryRows: ProblemGridVmCategoryMatrix[][];
  xCats: ProblemCategory[];
  yCats: ProblemCategory[];
}
