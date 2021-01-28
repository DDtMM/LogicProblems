import { Component } from '@angular/core';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { ClueSpanState, GameState } from '../game-state/game-state';
import { GameStateService } from '../game-state/game-state.service';

interface ProblemClueSpanViewModel {
  clueIdx: number;
  content: string;
  isExcluded?: boolean;
  spanIdx: number;
}
@Component({
  selector: 'app-problem-clues',
  templateUrl: './problem-clues.component.html',
  styleUrls: ['./problem-clues.component.scss'],
})
export class ProblemCluesComponent {

  readonly vm$ = this.gameStateSvc.gameState$.pipe(
    filter((x): x is GameState => !!x),
    // start with the first non-empty state and return an subsequent ones from init.
    filter((x, i) => i === 0 || x.action === 'init'),
    map(gs => this.gameStateToViewModel(gs)),
    switchMap((vm) => this.gameStateSvc.gameState$.pipe(
        filter((x): x is GameState => x?.action === 'updateClue'),
        map(gs => {
          vm.flat().forEach(x => x.isExcluded = this.getIsExcluded(gs, x.clueIdx, x.spanIdx));
          return vm;
        }),
        startWith(vm)
      )
    )
  );

  constructor(private gameStateSvc: GameStateService) { }

  toggleClue(clueSpans: ClueSpanState[]) {
    // exclude clues if any is not
    const isExcluded = clueSpans.some(x => !x.isExcluded);
    clueSpans.filter(x => x.isExcluded !== isExcluded)
      .forEach(x => this.gameStateSvc.updateClueSpanState(x.clueIdx, x.spanIdx, isExcluded));
  }
  toggleSpan(clueSpan: ClueSpanState) {
    this.gameStateSvc.updateClueSpanState(clueSpan.clueIdx, clueSpan.spanIdx, !clueSpan.isExcluded);
  }

  private gameStateToViewModel(gs: GameState) {
    return gs.def.clues.map((clue, clueIdx) => clue.spans.map((span, spanIdx) => ({
        clueIdx,
        isExcluded: this.getIsExcluded(gs, clueIdx, spanIdx),
        content: span.content,
        spanIdx
      } as ProblemClueSpanViewModel)));
  }

  private getIsExcluded(gs: GameState, clueIdx: number, spanIdx: number) {
    return gs.clueSpans.find(x => x.clueIdx === clueIdx && x.spanIdx === spanIdx)?.isExcluded ?? false;
  }


}
