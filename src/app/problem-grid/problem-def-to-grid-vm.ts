/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ProblemCategoryVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

export function problemDefToGridVm(def: ProblemDef): ProblemGridVm {
  const dimCatsCount = def.categories.length - 1;
  const xCats = [ def.categories[0], ... def.categories.slice(2) ].map(categoryToVm);
  const yCats = def.categories.slice(1).map(categoryToVm);
  const categoryRows: ProblemGridVmCategoryMatrix[][] = [];

  for (let yIdx = 0; yIdx < dimCatsCount; yIdx++) {
    const row: ProblemGridVmCategoryMatrix[] = [];
    for (let xIdx = 0; xIdx < dimCatsCount - yIdx; xIdx++) {
      // isLast is true for x and y category is it is the last matrix in the row.
      const isLast = xIdx === dimCatsCount - yIdx - 1;
      const xCat = { ...xCats[xIdx], isFirst: xIdx === 0, isLast };
      const yCat = { ...yCats[yIdx], isFirst: yIdx === 0, isLast };
      row.push(createCategoryMatrix(xCat, yCat));
    }
    categoryRows.push(row);
  }

  return {
    matrices: categoryRows,
    xCats,
    yCats
  };
}

function categoryToVm(cat: ProblemCategory, _: number, cats: ProblemCategory[]): ProblemCategoryVm {
  const catIndex = cats.indexOf(cat);
  const itemOffset = cats.slice(0, catIndex).reduce((prev, cur) => prev + cur.items.length, 0);
  return { ...cat, isFirst: catIndex === 0, isLast: catIndex === cats.length - 1, itemOffset };
}
function createCategoryMatrix(catX: ProblemCategoryVm, catY: ProblemCategoryVm): ProblemGridVmCategoryMatrix {
  return {
    catX,
    catY,
    elems: catY.items.map(itemY => catX.items.map(itemX => ({ state: 'open', itemX, itemY })))
  };
}
