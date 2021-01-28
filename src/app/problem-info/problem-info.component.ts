/* eslint-disable no-underscore-dangle */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProblemDef } from '../models/problem-def';

export type ProblemInfoComponentState = 'closed' | 'open';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-info',
  templateUrl: './problem-info.component.html',
  styles: [
  ]
})
export class ProblemInfoComponent {

  @Input()
  def?: ProblemDef;

  @Input()
  get state() { return this._state; }
  set state(value: ProblemInfoComponentState) {
    this._state = value;
    this.stateChange.next(value);
  }

  @Output()
  readonly stateChange = new EventEmitter<ProblemInfoComponentState>();

  private _state: ProblemInfoComponentState = 'closed';

  constructor(private cd: ChangeDetectorRef) {}

  hide() {
    this.state = 'closed';
    this.cd.detectChanges();
  }

  show() {
    this.state = 'open';
    this.cd.detectChanges();
  }

  getDescription() {
    return this.def?.description?.replace('\n', '<br /><br />');
  }
}
