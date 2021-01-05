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

  getItemClass(matrix: ProblemGridVmCategoryMatrix, item: ProblemGridItemVm, rowIndex: number, colIndex: number) {
    const cssClass: string[] = [ item.state ];
    if (rowIndex === 0) {
      cssClass.push('border-top');
    }
    if (rowIndex === matrix.catY.items.length - 1) {
      cssClass.push('border-bottom');
    }
    if (colIndex === 0) {
      cssClass.push('border-left');
    }
    if (colIndex === matrix.catX.items.length - 1) {
      cssClass.push('border-right');
    }
    return cssClass;
  }
  getItemGridIndex(cats: ProblemCategory[], cat: ProblemCategory, item: ProblemItem) {
    const itemsPrior = this.getPriorCatsCount(cats, cat);
    // offset start index by 3 since cols are 1 indexed and there should be 2 in dimension previous.
    return `${3 + itemsPrior + cat.items.indexOf(item)} / span 1`;
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
