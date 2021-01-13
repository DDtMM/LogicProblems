import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState, ProblemElemState } from './models/game-state';
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
      matrices: yCats.map(catY => xCats.map(catX => ({
        catX,
        catY,
        elems: catY.items.map(() => catX.items.map<ProblemElemState>(() => 'open'))
      })))
    };
    this.gameState$.next(gameState);
  }
}
