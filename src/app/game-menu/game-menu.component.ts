import { ChangeDetectionStrategy, Component } from '@angular/core';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';
import { GameStateService } from '../game-state/game-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styles: [
  ]
})
export class GameMenuComponent {
  readonly canUndo$ = this.gameStateSvc.gameState$.pipe(
    map(x => (x?.history?.length || 0) > 0),
    startWith(false),
    distinctUntilChanged(),
    shareReplay(1)
  );

  readonly elapsedTime$ = this.gameStateSvc.gameState$.pipe(
    map(x => x ? x.priorElapsedMs + (new Date().valueOf() - x.sessionStart.valueOf()) : 0)
  );

  constructor(private gameStateSvc: GameStateService) { }

  doUndo() {
    this.gameStateSvc.undoElemState();
  }

  restart() {
    this.gameStateSvc.restart();
  }

}
