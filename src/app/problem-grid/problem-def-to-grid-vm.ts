import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

export function problemDefToGridVm(def: ProblemDef): ProblemGridVm {
  const dimCatsCount = def.categories.length - 1;
  const xCats = [ def.categories[0], ... def.categories.slice(2) ];
  const yCats = def.categories.slice(1);
  const categoryRows: ProblemGridVmCategoryMatrix[][] = [];

  for (let idxX = 0; idxX < dimCatsCount; idxX++) {
    const row: ProblemGridVmCategoryMatrix[] = [];
    for (let idxY = idxX + 1; idxY < dimCatsCount + 1; idxY++) {
      row.push(createCategoryMatrix(xCats[idxX], yCats[idxY]));
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
    itemMatrix: catX.items.map(itemX => catY.items.map(itemY => ({ state: 'open', itemX, itemY })))
  };
}
