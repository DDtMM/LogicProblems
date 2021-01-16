/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { ElemState, GameState, GameStateMatrix } from '../game-state/game-state';
import { ProblemCategory } from '../models/problem-category';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

export function gameStateToGridVm(gameStateMatrices: GameStateMatrix[][], baseUnit: number, itemLabelMultiplier: number): ProblemGridVm {
  const xCats = gameStateMatrices[0].map(m => m.catX).map((cat, _, cats) => categoryToVm(cat, cats, false));
  const yCats = gameStateMatrices.map(r => r[0].catY).map((cat, _, cats) => categoryToVm(cat, cats, true));
  const matrices = gameStateMatrices.map((x, catYIdx) => x.map(({ elems }, catXIdx) =>
    createCategoryMatrix(catXIdx, catYIdx, elems)));
  const totalLength = (1 + itemLabelMultiplier + xCats.reduce((prev, cur) => prev + cur.items.length, 0)) * baseUnit + 1;
  const tracks = [...createTrackRects(xCats, false), ...createTrackRects(yCats, true)];
  return {
    baseUnit,
    itemLabelMultiplier,
    matrices,
    totalLength,
    tracks,
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
      }))
    };
  }

  function createCategoryMatrix(catXIdx: number, catYIdx: number, elems: ElemState[][]): ProblemGridVmCategoryMatrix {
    return {
      catXIdx,
      catYIdx,
      elems: elems.map((row, yIdx) => row.map<ProblemGridElemVm>((e, xIdx) => ({
        elemId: e.elemId,
        error: e.validationError,
        gridRect: {
          height: baseUnit,
          width: baseUnit,
          x: (1 + itemLabelMultiplier + catXIdx * row.length + xIdx) * baseUnit,
          y: (1 + itemLabelMultiplier + catYIdx * row.length + yIdx) * baseUnit,
        },
        state: e.visibleState
      })))
    };
  }

  /** Creates a rectangle the encompasses the full area of a category. */
  function createTrackRects(cats: ProblemCategoryVm[], isVert: boolean) {
    return cats.map(({items, labelRect}, i) => {
      const length = (1 + itemLabelMultiplier + items.length * (cats.length - i)) * baseUnit;
      return {
        ...labelRect,
        height: isVert ? labelRect.height : length,
        width: isVert ? length : labelRect.width
      };
    });
  }
}


