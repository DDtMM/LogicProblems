import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { GameStateService } from '../game-state.service';
import { gameStateToGridVm } from './game-state-to-grid-vm';
import { ProblemGridElemVm } from './problem-grid-vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.svg',
  styleUrls: ['./problem-grid.component.scss']
})
export class ProblemGridComponent {
  baseUnit = 16;
  readonly gridVm$ = this.gameStateSvc.gameState$.pipe(
    map(x => x ? gameStateToGridVm(x, this.baseUnit, this.itemLabelMultiplier) : undefined)
  );
  itemLabelMultiplier = 5;

  constructor(private gameStateSvc: GameStateService) { }

  /** This is temporarilary updating the vm.  It should update a state. */
  toggleState(elem: ProblemGridElemVm) {
    //this.gameStateSvc.toggleState(elem.)
  }

}
