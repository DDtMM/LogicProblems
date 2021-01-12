import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import { ProblemItem } from '../models/problem-item';
import { problemDefToGridVm } from './problem-def-to-grid-vm';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

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
  set problem(value: ProblemDef | undefined) {
    this.gridVm = value ? problemDefToGridVm(value) : undefined;
  }

  constructor() { }


  getViewbox() {
    // 1 unit for the category label, plus X units for the item label, plus Y units for the items,
    // plus Z viewbox units so the grid border isn't cutoff.
    const vbLength = (this.itemLabelMultiplier + 1 + this.getGridLength()) * this.baseUnit + 1;
    return `0 0 ${vbLength} ${vbLength}`;
  }

  /** Creates a 2d transform by converting units.  */
  getTransformTranslate(xUnits: number, yUnits: number) {
    return `translate(${xUnits * this.baseUnit}, ${yUnits * this.baseUnit})`;
  }

  getGridLength() {
    return (this.gridVm?.xCats || []).reduce((prev, cur) => prev + cur.items.length, 0);
  }
  getCatLabelGridRange(cat: ProblemCategoryVm) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return { index: 3 + cat.itemOffset, length: cat.items.length };
  }

  getItemGridIndex(cat: ProblemCategoryVm, item: ProblemItem) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return { index: 3 + cat.itemOffset + cat.items.indexOf(item), length: 1 };
  }

  getCatColor(catX?: ProblemCategoryVm, catY?: ProblemCategoryVm) {
    const colorR = catX ? 247 - (catX.index * 16) : 191;
    const colorB = catY ? 255 - (catY.index * 16) : 191;
    const color = `rgba(${colorR}, 255, ${colorB}, 1)`;
    return color;
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
    console.log(`new state: ${elem.state}`);
  }

}
