import { ChangeDetectorRef, Directive, ElementRef, Host, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rect } from './problem-grid-vm';
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

  @HostBinding('attr.transform-origin')
  attrTransformOrigin?: string;

  @HostBinding('attr.x')
  attrX = 0;

  @HostBinding('attr.y')
  attrY = 0;

  /** How many grid units long is the label. */
  @Input()
  rect?: Rect;

  /** padding in grid units */
  @Input()
  padding = .2;

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

  private calcPadding() {
    return this.padding * this.grid.baseUnit;
  }

  /** Gets a scale transform if the passed element exceeds width or height. */
  private getTransformScale(maxWidthPx: number, maxHeightPx: number) {
    const elem = this.elemRef.nativeElement as SVGGraphicsElement;
    const bb = elem.getBBox();
    const scaleX = maxWidthPx / bb.width;
    const scaleY = maxHeightPx / bb.height;
    const scale = Math.min(scaleX, scaleY);
    if (scale < 1) {
      const translateX = (1 - scale) * (this.attrX - (this.rect?.x || 0));
      const translateY = (1 - scale) * (this.attrY - (this.rect?.y || 0));
      return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    }
    return undefined;
  }

  private update() {
    if (!this.rect) {
      return;
    }
    const { x, y } = { ...this.rect };
    // swap width and height if vertical.  Text element will be setup as though it was horizontal, and then rotated with a transform.
    const height = this.orientation === 'vert' ? (this.rect?.width || 0) : (this.rect?.height || 0);
    const width = this.orientation === 'vert' ? (this.rect?.height || 0) : (this.rect?.width || 0);
    const padding = this.calcPadding();

    switch (this.textAlign) {
      case 'center':
        this.attrTextAnchor = 'middle';
        this.attrX = x + width / 2;
        break;
      case 'right':
        this.attrTextAnchor = 'end';
        this.attrX = x + width - padding;
        break;
      default:
        this.attrTextAnchor = 'start';
        this.attrX = x + padding;
    }
    this.attrY = y + (height) / 2;
    this.attrTransformOrigin = `${x} ${y}`;
    const transforms: string[] = [];
    if (this.orientation === 'vert') {
      transforms.push(`rotate(-90) translate(${width * -1}, 0)`);
    }
    setTimeout(() => {
      // the text object needs to be drawn first before we can get the bounding box to calculate how much to scale the text.
      const scaleTransform = this.getTransformScale(width - padding * 2, height);
      if (scaleTransform) {
        transforms.push(scaleTransform);
      }
      this.attrTransform = transforms.length ? transforms.join(' ') : undefined;
      this.cd.detectChanges();
    }, 0);

  }
}
