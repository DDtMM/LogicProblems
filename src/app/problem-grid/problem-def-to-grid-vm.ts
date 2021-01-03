import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

export function problemDefToGridVm(def: ProblemDef): ProblemGridVm {
  const dimCatsCount = def.categories.length - 1;
  const xCats = [ def.categories[0], ... def.categories.slice(2) ];
  const yCats = def.categories.slice(1);
  const categoryRows: ProblemGridVmCategoryMatrix[][] = [];

  for (let yIdx = 0; yIdx < dimCatsCount; yIdx++) {
    const row: ProblemGridVmCategoryMatrix[] = [];
    for (let xIdx = 0; xIdx < dimCatsCount - yIdx; xIdx++) {
      row.push(createCategoryMatrix(xCats[xIdx], yCats[yIdx]));
    }
    categoryRows.push(row);
  }

  return {
    categoryRows
  };
}

function createCategoryMatrix(catX: ProblemCategory, catY: ProblemCategory): ProblemGridVmCategoryMatrix {
  return {
    catX,
    catY,
    itemMatrix: catY.items.map(itemY => catX.items.map(itemX => ({ state: 'open', itemX, itemY })))
  };
}
