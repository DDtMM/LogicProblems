import { Component, Input } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import { ProblemItem } from '../models/problem-item';
import { problemDefToGridVm } from './problem-def-to-grid-vm';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

@Component({
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.html',
  styleUrls: ['./problem-grid.component.scss']
})
export class ProblemGridComponent {
  gridVm?: ProblemGridVm;

  @Input()
  set problem(value: ProblemDef | undefined) {
    this.gridVm = value ? problemDefToGridVm(value) : undefined;
  }

  constructor() { }

  getCatLabelGridRange(cat: ProblemCategoryVm) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return `${3 + cat.itemOffset} / span ${cat.items.length}`;
  }

  getMatrixElemClass(matrix: ProblemGridVmCategoryMatrix, elem: ProblemGridElemVm) {
    return [ elem.state, ...this.getBorderX(matrix.catX, elem.itemX), ...this.getBorderY(matrix.catY, elem.itemY) ];
  }
  getItemGridIndex(cat: ProblemCategoryVm, item: ProblemItem) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return `${3 + cat.itemOffset + cat.items.indexOf(item)} / span 1`;
  }
  /** Gets border classes for a category or an item in a category. */
  getBorderClass(cat: ProblemCategoryVm, item: ProblemItem | undefined, firstClass: string, lastClass: string, invert?: boolean) {
    const cssClasses: string[] = [];
    if (invert) {
      const temp = lastClass;
      lastClass = firstClass;
      firstClass = temp;
    }
    if (item) {
      // item mode.
      const itemIndex = cat.items.indexOf(item);
      if (itemIndex === 0 && cat.isFirst) { cssClasses.push(firstClass); }
      if (itemIndex === cat.items.length - 1) { cssClasses.push(lastClass); }
    }
    else {
      // category always gets the closing border, and only the first gets the opening border.
      if (cat.isFirst) { cssClasses.push(firstClass, lastClass); }
      else { cssClasses.push(lastClass); }
    }

    return cssClasses;
  }
  getBorderX(cat: ProblemCategoryVm, item?: ProblemItem, invert?: boolean) {
    return this.getBorderClass(cat, item, 'border-left', 'border-right', invert);
  }
  getBorderY(cat: ProblemCategoryVm, item?: ProblemItem, invert?: boolean) {
    return this.getBorderClass(cat, item, 'border-top', 'border-bottom', invert);
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
