/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ElemState, ElemStateValue, GameState, GameStateMatrix, ValidationError } from './game-state';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  readonly gameState$ = new BehaviorSubject<GameState | undefined>(undefined);

  constructor() { }

  initState(def: ProblemDef) {
    const matrices = createMatrices();
    const elements = new Map(matrices.flatMap(x => x.flatMap(y => y.elems.flat())).map(x => [x.elemId, x]));
    const gameState: GameState = { action: 'init', def, elements, matrices };
    this.gameState$.next(gameState);

    function createMatrices() {
      let matrixIdx = 0;
      const matrixSize = Math.pow(def.categories[0].items.length, 2);
      const xCats = [def.categories[0], ...def.categories.slice(2)];
      const yCats = [def.categories[1], ...def.categories.slice(3), ...def.categories.slice(2, 3)];
      return yCats.map((catY, yIdx) => xCats.slice(0, xCats.length - yIdx)
        .map((catX, xIdx) => addElements({ catX, catY, elems: [], xIdx, yIdx }, matrixSize * matrixIdx++)));
    }
    function addElements(matrix: GameStateMatrix, nextElemId: number) {
      matrix.catY.items.forEach((_, yIdx) =>
        matrix.elems.push(
          matrix.catX.items.map<ElemState>((__, xIdx) => ({
            elemId: nextElemId++,
            explicitState: 'open',
            matrix,
            visibleState: 'open',
            xIdx,
            yIdx
          }))
        )
      );
      return matrix;
    }
  }

  toggleState(elemId: number) {
    const elem = this.gameState$.value?.elements.get(elemId);
    if (elem) {
      const nextState = (elem.visibleState === 'accept') ? 'open'
        : (elem.visibleState === 'open') ? 'reject' : 'accept';
      this.updateState(elemId, nextState);
    }
  }
  updateState(elemId: number, nextState: ElemStateValue) {
    const gs = this.gameState$.value;
    const elem = gs?.elements.get(elemId);
    if (gs && elem) {
      elem.explicitState = elem.visibleState = nextState;
      elem.matrix.elems.flat().filter(x => x.explicitState === 'open')
        .forEach(x => {
          const { col, row } = this.getSiblings(x);
          x.visibleState = col.concat(row).some(y => y.visibleState === 'accept') ? 'reject' : 'open';
        });
      this.validateGame(gs);
      gs.action = 'update';
      this.gameState$.next(gs);
    }
  }
  /** updates game validations. */
  validateGame(gs: GameState) {
    let hasErrors = false;
    gs.matrices.flat().forEach(m => {
      m.elems.flat().forEach(x => x.validationError = undefined);
      const dimensions = this.getMatrixCols(m).concat(m.elems);
      dimensions.forEach(dim => {
        const accepted = dim.filter(x => x.visibleState === 'accept');
        if (accepted.length >= 2) {
          accepted.forEach(x => x.validationError = 'multipleAccepted');
          hasErrors = true;
        }
        if (dim.every(x => x.visibleState === 'reject')) {
          dim.forEach(x => x.validationError = 'dimensionRejected');
          hasErrors = true;
        }
      });
    });
    gs.hasErrors = hasErrors;
  }
  validateMove(elemId: number, nextState: ElemStateValue): ValidationError | undefined {
    const elem = this.gameState$.value?.elements.get(elemId);
    if (elem) {
      const { col, row } = this.getSiblings(elem);
      switch (nextState) {
        case 'accept':
          if (col.some(x => x.visibleState === 'accept') || row.some(x => x.visibleState === 'accept')) {
            return 'multipleAccepted';
          }
          break;
        case 'reject':
          if (col.every(x => x.visibleState === 'reject') || row.every(x => x.visibleState === 'reject')) {
            return 'dimensionRejected';
          }
          break;
      }
    }
    return undefined;
  }



  private getMatrixCols(matrix: GameStateMatrix) {
    // since the matrix is a square, converting rows to cols is as simple as swapping indexes.
    return matrix.elems.map((row, yIdx) => row.map((_, xIdx) => matrix.elems[xIdx][yIdx]));
  }
  private getSiblings(elem: ElemState) {
    return {
      col: elem.matrix.elems.map(x => x[elem.xIdx]).filter(x => x.yIdx !== elem.yIdx),
      row: elem.matrix.elems[elem.yIdx].filter(x => x.xIdx !== elem.xIdx)
    };
  }
}
