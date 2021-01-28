import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { concat } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { GameState } from '../game-state/game-state';

import { GameStateService } from '../game-state/game-state.service';
import { elemToGridVm, gameStateToGridVm } from './game-state-to-grid-vm';
import { ProblemGridElemVm } from './problem-grid-vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.html',
  styleUrls: ['./problem-grid.component.scss'],
})
export class ProblemGridComponent {
  baseUnit = 16;
  readonly gridVm$ = this.gameStateSvc.gameState$.pipe(
    filter((x): x is GameState => !!x),
    // start with the first non-empty state and return an subsequent ones from init.
    filter((x, i) => i === 0 || x.action === 'init'),
    map((x) => gameStateToGridVm(x.matrices, this.baseUnit, this.itemLabelMultiplier))
  );
  itemLabelMultiplier = 4;

  readonly values$ = this.gameStateSvc.gameState$.pipe(
    filter((x): x is GameState => !!x),
    map((x) => Array.from(x.elements.values()).map(y => elemToGridVm(y, this.baseUnit, this.itemLabelMultiplier)))
  );

  constructor(private gameStateSvc: GameStateService) { }

  /** This is temporarilary updating the vm.  It should update a state. */
  toggleState(elem: ProblemGridElemVm) {
    this.gameStateSvc.toggleElemState(elem.elemId);
  }

}
