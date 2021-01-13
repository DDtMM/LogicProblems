import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameStateService } from '../game-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-problem-host',
  templateUrl: './problem-host.component.html',
  styleUrls: ['./problem-host.component.scss']
})
export class ProblemHostComponent {

  readonly gameState$ = this.gameStateSvc.gameState$;

  constructor(private gameStateSvc: GameStateService) { }
}
