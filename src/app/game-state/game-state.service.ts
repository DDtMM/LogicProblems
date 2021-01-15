import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ElemState, ElemStateValue, GameState, GameStateMatrix } from './game-state';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  readonly gameState$ = new BehaviorSubject<GameState | undefined>(undefined);

  constructor() { }

  initState(def: ProblemDef) {
    let nextElementId = 0;
    const xCats = [def.categories[0], ...def.categories.slice(2)];
    const yCats = [def.categories[1], ...def.categories.slice(3), ...def.categories.slice(2, 3)];
    const matrices = yCats.map((catY, yIdx) => xCats.slice(0, xCats.length - yIdx).map(catX => ({ catX, catY })))
      .map(intersections => intersections.map(({ catX, catY }) => {
        const matrix = this.createMatrix(catX, catY, nextElementId);
        nextElementId = Math.max(...matrix.elems.flat().map(x => x.elemId)) + 1;
        return matrix;
      }));

    const elements = new Map(matrices.flatMap(x => x.flatMap(y => y.elems.flat())).map(x => [x.elemId, x]));

    const gameState: GameState = {
      def,
      elements,
      matrices
    };
    console.log(gameState);
    this.gameState$.next(gameState);
  }

  toggleState(elemId: number) {
    const gs = this.gameState$.value;
    const elem = gs?.elements.get(elemId);
    if (elem) {
      const nextState = (elem.visibleState === 'accept') ? 'open'
        : (elem.visibleState === 'open') ? 'reject' : 'accept';
      this.updateState(elemId, nextState);
    }
  }

  updateState(elemId: number, nextState: ElemStateValue) {
    const gs = this.gameState$.value;
    const elem = gs?.elements.get(elemId);
    if (elem) {
      elem.explicitState = elem.visibleState = nextState;
      const { matrix, yIdx, xIdx } = elem;
      if (nextState === 'open') {
        matrix.elems[yIdx].concat(matrix.elems.map(x => x[xIdx]))
          .filter(x => x.explicitState !== x.visibleState)
          .forEach(x => x.visibleState = x.explicitState);
      }
      else if (nextState === 'accept') {
        matrix.elems[yIdx].concat(matrix.elems.map(x => x[xIdx]))
          .filter(x => x.visibleState === 'open')
          .forEach(x => x.visibleState = 'reject');
      }
      this.gameState$.next(gs);
    }
  }

  private createMatrix(catX: ProblemCategory, catY: ProblemCategory, nextElemId: number) {
    const matrix: GameStateMatrix = {
      catX,
      catY,
      elems: []
    };
    catY.items.forEach((_, yIdx) =>
      matrix.elems.push(
        catX.items.map<ElemState>((__, xIdx) => ({
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
