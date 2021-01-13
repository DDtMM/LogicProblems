import { Directive, HostBinding, Input, OnChanges } from '@angular/core';
import { ProblemCategoryVm, Rect } from './problem-grid-vm';

@Directive({
  selector: '[appProblemGridRect]'
})
export class ProblemGridRectDirective implements OnChanges {
  @HostBinding('attr.fill')
  attrFill?: string;

  @HostBinding('attr.height')
  attrHeight = 0;

  @HostBinding('attr.width')
  attrWidth = 0;

  @HostBinding('attr.x')
  attrX = 0;

  @HostBinding('attr.y')
  attrY = 0;

  /** required rectangle. */
  @Input()
  rect?: Rect;

  /** Optional x dimension category. */
  @Input()
  catX?: ProblemCategoryVm;

  /** Optional y dimension category. */
  @Input()
  catY?: ProblemCategoryVm;


  constructor() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  getCatColor() {
    const colorX: number = this.catX ? 231 - (this.catX.index * 12) : 255;
    const colorY: number = this.catY ? 239 - (this.catY.index * 12) : 255;
    const color = `rgb(255, ${colorX}, ${colorY})`;
    return color;
  }

  private update() {
    this.attrFill = this.getCatColor();
    this.attrHeight = this.rect?.height || 0;
    this.attrWidth = this.rect?.width || 0;
    this.attrX = this.rect?.x || 0;
    this.attrY = this.rect?.y || 0;
  }
}
