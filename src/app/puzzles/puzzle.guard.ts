import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GameStateService } from '../game-state/game-state.service';
import { PuzzlesService } from './puzzles.service';

@Injectable({
  providedIn: 'root'
})
export class PuzzleGuard implements CanActivate {
  constructor(private puzzlesSvc: PuzzlesService, private gameStateSvc: GameStateService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean> {
    const puzzleIdx = parseInt(route.paramMap.get('puzzleIdx') ?? '-1', 10);
    if (isNaN(puzzleIdx) || puzzleIdx < 0) {
      return of(false);
    }
    return this.puzzlesSvc.puzzles[puzzleIdx].def$.pipe(
      tap(x => this.gameStateSvc.initState(x, puzzleIdx)),
      map(x => !!x)
    );
  }
}
