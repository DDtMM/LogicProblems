import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GameState } from '../models/game-state';
import { ProblemDef } from '../models/problem-def';
import { ProblemItem } from '../models/problem-item';
import { gameStateToGridVm } from './game-state-to-grid-vm';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix, ProblemItemVm } from './problem-grid-vm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.svg',
  styleUrls: ['./problem-grid.component.scss']
})
export class ProblemGridComponent {
  /** How big is each grid square vs a viewBox unit. */
  baseUnit = 16;
  gridVm?: ProblemGridVm;
  /** How much longer is an item label vs a grid square. */
  itemLabelMultiplier = 5;

  @Input()
  set gameState(value: GameState | undefined) {
    this.gridVm = value ? gameStateToGridVm(value, this.baseUnit, this.itemLabelMultiplier) : undefined;
  }

  constructor() { }

  getViewbox() {
    // 1 unit for the category label, plus X units for the item label, plus Y units for the items,
    // plus Z viewbox units so the grid border isn't cutoff.
    const vbLength = (this.itemLabelMultiplier + 1 + this.getGridLength()) * this.baseUnit + 1;
    return `0 0 ${vbLength} ${vbLength}`;
  }

  getGridLength() {
    return (this.gridVm?.xCats || []).reduce((prev, cur) => prev + cur.items.length, 0);
  }

  /** This is temporarilary updating the vm.  It should update a state. */
  toggleState(elem: ProblemGridElemVm) {
    switch (elem.state) {
      case 'accept':
        elem.state = 'open';
        break;
      case 'reject':
        elem.state = 'accept';
        break;
      case 'open':
        elem.state = 'reject';
        break;
    }
  }

}
