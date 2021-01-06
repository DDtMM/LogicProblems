import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProblemCategory } from '../models/problem-category';
import { ProblemDef } from '../models/problem-def';
import { ProblemItem } from '../models/problem-item';
import { ProblemGridItemVm } from '../problem-grid-item/problem-grid-item-vm';
import { problemDefToGridVm } from './problem-def-to-grid-vm';
import { ProblemGridVm, ProblemGridVmCategoryMatrix } from './problem-grid-vm';

@Component({
  selector: 'app-problem-grid',
  templateUrl: './problem-grid.component.html',
  styleUrls: ['./problem-grid.component.scss']
})
export class ProblemGridComponent implements OnInit {

  gridVm?: ProblemGridVm;

  @Input()
  set problem(value: ProblemDef | undefined) {
    this.gridVm = value ? problemDefToGridVm(value) : undefined;
  }

  constructor() { }

  ngOnInit(): void {
  }

  getCatLabelGridRange(cats: ProblemCategory[], cat: ProblemCategory) {
    const itemsPrior = this.getPriorCatsCount(cats, cat);
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return `${3 + itemsPrior} / span ${cat.items.length}`;
  }

  getMatrixItemClass(matrix: ProblemGridVmCategoryMatrix, item: ProblemGridItemVm) {
    const cssClass: string[] = [ item.state ];
    const yBorder = this.getYBorder(matrix.catY, item.itemY);
    const xBorder = this.getXBorder(matrix.catX, item.itemX);
    if (xBorder) {
      cssClass.push(xBorder);
    }
    if (yBorder) {
      cssClass.push(yBorder);
    }
    return cssClass;
  }
  getItemGridIndex(cats: ProblemCategory[], cat: ProblemCategory, item: ProblemItem) {
    const itemsPrior = this.getPriorCatsCount(cats, cat);
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return `${3 + itemsPrior + cat.items.indexOf(item)} / span 1`;
  }
  getBorderClass(cat: ProblemCategory, item: ProblemItem, firstClass: string, lastClass: string, invert?: boolean) {
    switch (cat.items.indexOf(item)) {
      case 0: return invert ? lastClass : firstClass;
      case cat.items.length - 1: return invert ? firstClass : lastClass;
    }
    return '';
  }
  getXBorder(cat: ProblemCategory, item: ProblemItem, invert?: boolean) {
    return this.getBorderClass(cat, item, 'border-left', 'border-right', invert);
  }
  getYBorder(cat: ProblemCategory, item: ProblemItem) {
    return this.getBorderClass(cat, item, 'border-top', 'border-bottom');
  }

  toggleState(mItem: ProblemGridItemVm) {
    switch (mItem.state) {
      case 'accept':
        mItem.state = 'open';
        break;
      case 'reject':
        mItem.state = 'accept';
        break;
      case 'open':
        mItem.state = 'reject';
        break;
    }
  }

  private getPriorCatsCount(cats: ProblemCategory[] | undefined, cat: ProblemCategory) {
    const catIndex = cats?.indexOf(cat) ?? -1;
    return (cats || [])
      .slice(0, catIndex)
      .map(x => x.items.length)
      .reduce((prev, cur) => prev + cur, 0);
  }
}
