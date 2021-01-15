import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

import { Rect } from './problem-grid-vm';

@Directive({
  selector: '[appProblemGridRect]'
})
export class ProblemGridRectDirective implements OnChanges {
  @HostBinding('attr.class')
  attrClass?: string;

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

  /** Optional x dimension index. */
  @Input()
  catX?: number;

  /** Optional y dimension category. */
  @Input()
  catY?: number;

  constructor() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  private update() {
    const classes: string[] = [];
    if (this.catX != null) {
      classes.push(`cat-x-${this.catX + 1}`);
    }
    if (this.catY != null) {
      classes.push(`cat-y-${this.catY + 1}`);
    }
    this.attrClass = classes.join(' ');
    this.attrHeight = this.rect?.height || 0;
    this.attrWidth = this.rect?.width || 0;
    this.attrX = this.rect?.x || 0;
    this.attrY = this.rect?.y || 0;
  }
}
