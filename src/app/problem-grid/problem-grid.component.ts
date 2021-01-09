import { Component, Input } from '@angular/core';
import { ProblemDef } from '../models/problem-def';
import { ProblemItem } from '../models/problem-item';
import { problemDefToGridVm } from './problem-def-to-grid-vm';
import { ProblemCategoryVm, ProblemGridElemVm, ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

@Component({
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.svg',
  styleUrls: ['./problem-grid.component.scss']
})
export class ProblemGridComponent {
  gridVm?: ProblemGridVm;
  baseUnit = 16;
  itemLabelMultiplier = 5;
  @Input()
  set problem(value: ProblemDef | undefined) {
    this.gridVm = value ? problemDefToGridVm(value) : undefined;
  }

  constructor() { }

  getViewbox() {
    const vbLength = (this.itemLabelMultiplier + 1 + this.getGridLength()) * this.baseUnit;
    return `0 0 ${vbLength} ${vbLength}`;
  }
  getTranslate(xUnit: number, yUnit: number) {
    return `translate(${xUnit * this.baseUnit}, ${yUnit * this.baseUnit})`;
  }

  getHorizLabelTransform(lengthUnit: number) {
    return `rotate(-90) translate(${lengthUnit * this.baseUnit * -1}, 0)`;
  }
  getGridLength() {
    return (this.gridVm?.xCats || []).reduce((prev, cur) => prev + cur.items.length, 0);
  }
  getCatLabelGridRange(cat: ProblemCategoryVm) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return { index: 3 + cat.itemOffset, length: cat.items.length };
  }

  getMatrixElemClass(matrix: ProblemGridVmCategoryMatrix, elem: ProblemGridElemVm) {
    return [elem.state, ...this.getBorderX(matrix.catX, elem.itemX), ...this.getBorderY(matrix.catY, elem.itemY)];
  }
  getItemGridIndex(cat: ProblemCategoryVm, item: ProblemItem) {
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return { index: 3 + cat.itemOffset + cat.items.indexOf(item), length: 1 };
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
    console.log(`new state: ${elem.state}`);
  }

}
