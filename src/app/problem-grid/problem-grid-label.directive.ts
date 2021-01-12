import { ChangeDetectorRef, Directive, ElementRef, Host, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProblemGridComponent } from './problem-grid.component';

@Directive({
  selector: '[appProblemGridLabel]',
})
export class ProblemGridLabelDirective implements OnChanges {
  @HostBinding('attr.alignment-baseline')
  readonly attrAlignmentBaseline = 'central';

  @HostBinding('attr.text-anchor')
  attrTextAnchor: 'end' | 'middle' | 'start' = 'start';

  @HostBinding('attr.transform')
  attrTransform?: string;

  @HostBinding('attr.x')
  attrX = 0;

  @HostBinding('attr.y')
  attrY = 0;

  /** How many grid units long is the label. */
  @Input()
  length?: number;

  /** padding in grid units */
  @Input()
  padding = .1;

  @Input()
  orientation?: 'horiz' | 'vert';

  @Input()
  textAlign?: 'left' | 'center' | 'right';

  constructor(private cd: ChangeDetectorRef, private elemRef: ElementRef, private grid: ProblemGridComponent) {
    this.update();
  }

  ngOnChanges(): void {
    this.update();
  }

  private calcLength() {
    return (this.length || this.grid.itemLabelMultiplier) * this.grid.baseUnit;
  }

  private calcPadding() {
    return this.padding * this.grid.baseUnit;
  }

  private getTransformForVerts() {
    return `rotate(-90) translate(${this.calcLength() * -1}, 0)`;
  }

  /** Gets a scale transform if the passed element exceeds width or height. */
  private getTransformScale(maxWidthPx: number, maxHeightPx: number) {
    const elem = this.elemRef.nativeElement as SVGGraphicsElement;
    const bb = elem.getBBox();
    const scaleX = maxWidthPx / bb.width;
    const scaleY = maxHeightPx / bb.height;
    const scale = Math.min(scaleX, scaleY);
    if (scale < 1) {
      const translateX = (1 - scale) * this.attrX;
      const translateY = (1 - scale) * this.attrY;
      return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    }
    return undefined;
  }

  private update() {

    switch (this.textAlign) {
      case 'center':
        this.attrTextAnchor = 'middle';
        this.attrX = this.calcLength() / 2;
        break;
      case 'right':
        this.attrTextAnchor = 'end';
        this.attrX = this.calcLength() - this.calcPadding();
        break;
      default:
        this.attrTextAnchor = 'start';
        this.attrX = this.calcPadding();
    }
    this.attrY = this.grid.baseUnit / 2;

    setTimeout(() => {
      // the text object needs to be drawn first before we can get the bounding box to calculate how much to scale the text.

      const transforms: string[] = [];
      const scaleTransform = this.getTransformScale(this.calcLength() - this.calcPadding() * 2, this.grid.baseUnit);
      if (scaleTransform) {
        transforms.push(scaleTransform);
      }
      if (this.orientation === 'vert') {
        transforms.push(this.getTransformForVerts());
      }
      this.attrTransform = transforms.length ? transforms.join(' ') : undefined;

      this.cd.detectChanges();
    }, 0);


  }
}
