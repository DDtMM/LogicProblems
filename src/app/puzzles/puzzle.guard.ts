import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate } from '@angular/router';

import { GameStateService } from '../game-state/game-state.service';
import { PuzzlesService } from './puzzles.service';

@Injectable({
  providedIn: 'root'
})
export class PuzzleGuard implements CanActivate, CanDeactivate<unknown> {
  constructor(private puzzlesSvc: PuzzlesService, private gameStateSvc: GameStateService) {

  }

  /** Use the guard to make sure puzzleIdx is valid.  If so, update game state. */
  canActivate(
    route: ActivatedRouteSnapshot): boolean {
    const puzzleIdx = parseInt(route.paramMap.get('puzzleIdx') ?? '-1', 10);
    const puzzle = this.puzzlesSvc.puzzles[puzzleIdx];
    if (!puzzle) {
      return false;
    }
    this.gameStateSvc.initState(puzzle.def, puzzleIdx);
    return true;
  }

  /** Use the gaurd as a way to save the currently active game. */
  canDeactivate(): boolean {
    this.gameStateSvc.saveGame();
    return true;
  }
}
