/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { GameState } from '../models/game-state';
import { ProblemCategory } from '../models/problem-category';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

export function gameStateToGridVm(gameState: GameState, baseUnit: number, itemLabelMultiplier: number): ProblemGridVm {
  const dimCatsCount = gameState.def.categories.length - 1;
  const xCats = gameState.matrices[0].map(m => m.catX).map((cat, _, cats) => categoryToVm(cat, cats, false));
  const yCats = gameState.matrices.map(r => r[0].catY).map((cat, _, cats) => categoryToVm(cat, cats, true));
  const categoryRows: ProblemGridVmCategoryMatrix[][] = [];

  for (let yIdx = 0; yIdx < dimCatsCount; yIdx++) {
    const row: ProblemGridVmCategoryMatrix[] = [];
    for (let xIdx = 0; xIdx < dimCatsCount - yIdx; xIdx++) {
      row.push(createCategoryMatrix(xCats[xIdx], yCats[yIdx]));
    }
    categoryRows.push(row);
  }

  return {
    baseUnit,
    itemLabelMultiplier,
    matrices: categoryRows,
    xCats,
    yCats
  };

  function categoryToVm(cat: ProblemCategory, cats: ProblemCategory[], isVert: boolean): ProblemCategoryVm {
    const catIndex = cats.indexOf(cat);
    const itemOffset = cats.slice(0, catIndex).reduce((prev, cur) => prev + cur.items.length, 0);
    const catLength = cat.items.length * baseUnit;
    const itemLabelLength = itemLabelMultiplier * baseUnit;
    return {
      ...cat,
      labelRect: (isVert)
        ? { height: catLength, width: baseUnit, x: 0, y: (1 + itemLabelMultiplier + itemOffset) * baseUnit }
        : { height: baseUnit, width: catLength, x: (1 + itemLabelMultiplier + itemOffset) * baseUnit, y: 0 },
      index: catIndex,
      isLabelVert: isVert,
      items: cat.items.map((x, itemIndex) => ({
        ...x,
        labelRect: (isVert)
          ? { height: baseUnit, width: itemLabelLength, x: baseUnit, y: (1 + itemLabelMultiplier + itemOffset + itemIndex) * baseUnit }
          : { height: itemLabelLength, width: baseUnit, x: (1 + itemLabelMultiplier + itemOffset + itemIndex) * baseUnit, y: baseUnit },
        isLabelVert: !isVert
      })),
      itemOffset
    };
  }

  function createCategoryMatrix(catX: ProblemCategoryVm, catY: ProblemCategoryVm): ProblemGridVmCategoryMatrix {
    return {
      catX,
      catY,
      elems: catY.items.map((itemY, idxY) =>
        catX.items.map<ProblemGridElemVm>((itemX, idxX) => ({
          gridRect: {
            height: baseUnit,
            width: baseUnit,
            x: (1 + itemLabelMultiplier + catX.itemOffset + idxX) * baseUnit,
            y: (1 + itemLabelMultiplier + catY.itemOffset + idxY) * baseUnit,
          },
          itemX,
          itemY,
          state: 'open'
        }))
      )
    };
  }
}


