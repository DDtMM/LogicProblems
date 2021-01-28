import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-host',
  templateUrl: './problem-host.component.html',
  styleUrls: ['./problem-host.component.scss']
})
export class ProblemHostComponent {

  constructor() { }
}
