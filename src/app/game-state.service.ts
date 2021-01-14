import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState, ElemStateValue } from './models/game-state';
import { IdType } from './models/id-type';
import { ProblemDef } from './models/problem-def';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  readonly gameState$ = new BehaviorSubject<GameState | undefined>(undefined);

  constructor() { }

  initState(def: ProblemDef) {
    const xCats = [def.categories[0], ...def.categories.slice(2)];
    const yCats = [def.categories[1], ...def.categories.slice(3), ...def.categories.slice(2, 3)];
    const gameState: GameState = {
      def,
      matrices: yCats.map((catY, yIdx) => xCats.slice(0, xCats.length - yIdx).map(catX => ({
        catX,
        catY,
        elems: catY.items.map(() => catX.items.map(() => ({
          explicitState: 'open',
          visibleState: 'open'
        })))
      })))
    };
    this.gameState$.next(gameState);
  }

  toggleState(yCatIdx: number, xCatIdx: number, xIdx: number, yIdx: number) {
    const gs = this.gameState$.value;
    if (gs) {
      const matrix = gs.matrices[yCatIdx][xCatIdx];
      const elemState = matrix.elems[yIdx][xIdx];
      const nextState = (elemState.visibleState === 'accept') ? 'open'
        : (elemState.visibleState === 'open') ? 'reject' : 'accept';
      elemState.explicitState = elemState.visibleState = nextState;
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
}
