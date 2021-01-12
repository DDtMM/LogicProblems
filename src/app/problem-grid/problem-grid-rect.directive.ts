import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, OnChanges } from '@angular/core';
import { ProblemItem } from '../models/problem-item';
import { ProblemCategoryVm } from './problem-grid-vm';
import { ProblemGridComponent } from './problem-grid.component';

@Directive({
  selector: '[appProblemGridRect]'
})
export class ProblemGridRectDirective implements OnChanges {
  @HostBinding('attr.fill')
  attrFill?: string;

  @HostBinding('attrHeight')
  attrHeight = 0;

  @HostBinding('attrWidth')
  attrWidth = 0;

  @Input()
  catX?: ProblemCategoryVm;

  @Input()
  catY?: ProblemCategoryVm;

  @Input()
  itemX?: ProblemItem;

  @Input()
  itemY?: ProblemItem;

  constructor(private cd: ChangeDetectorRef, private elemRef: ElementRef, private grid: ProblemGridComponent) {
    this.update();
  }

  ngOnChanges(): void {
    this.update();
  }

  getCatColor() {
    const colorR = this.catX ? 247 - (this.catX.index * 16) : 191;
    const colorB = this.catY ? 255 - (this.catY.index * 16) : 191;
    const color = `rgb(${colorR}, 255, ${colorB})`;
    return color;
  }

  private update() {
    this.attrFill = this.getCatColor();

    this.attrHeight = this.grid.baseUnit;
    this.attrWidth = this.grid.baseUnit;

    if ((!this.catX !== !this.catY) || (!this.itemX !== !this.itemY)) {
      if (this.itemX) {
        this.attrHeight = this.grid.baseUnit * this.grid.itemLabelMultiplier;
      }
      else if (this.itemY) {
        this.attrWidth = this.grid.baseUnit * this.grid.itemLabelMultiplier;
      }
      else if (this.catX) {
        this.attrWidth = this.grid.baseUnit * this.catX.items.length;
      }
      else if (this.catY) {
        this.attrHeight = this.grid.baseUnit * this.catY.items.length;
      }
    }

    this.cd.detectChanges();
  }
}
