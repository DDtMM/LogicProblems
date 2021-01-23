/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject } from 'rxjs';
import { ProblemDef } from '../models/problem-def';
import { ElemState, ElemStateValue, GameState, GameStateMatrix, SavedGame, SavedGames, ValidationError } from './game-state';


@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private static gameStatesCacheKey = 'gameState_gameStates';
  /** States in toggling order. */
  private static orderedStates: ElemStateValue[] = ['open', 'reject', 'accept'];
  readonly gameState$ = new BehaviorSubject<GameState | undefined>(undefined);

  constructor(private storageSvc: LocalStorageService) { }

  initState(def: ProblemDef, puzzleId: number) {
    const matrices = createMatrices();
    const elements = new Map(matrices.flatMap(x => x.flatMap(y => y.elems.flat())).map(x => [x.elemId, x]));
    const gameState: GameState = {
      action: 'init',
      def,
      elements,
      history: [],
      matrices,
      priorElapsedMs: 0,
      puzzleId,
      sessionStart: new Date()
    };
    this.gameState$.next(gameState);
    this.restoreGame();

    function createMatrices() {
      let matrixIdx = 0;
      const matrixSize = Math.pow(def.categories[0].items.length, 2);
      const xCats = [def.categories[0], ...def.categories.slice(2)];
      const yCats = [def.categories[1], ...def.categories.slice(3), ...def.categories.slice(2, 3)];
      return yCats.map((catY, yIdx) => xCats.slice(0, xCats.length - yIdx)
        .map((catX, xIdx) => addElements({ catX, catY, elems: [], xIdx, yIdx }, matrixSize * matrixIdx++)));
    }
    function addElements(matrix: GameStateMatrix, nextElemId: number) {
      matrix.catY.items.forEach((_, yIdx) =>
        matrix.elems.push(
          matrix.catX.items.map<ElemState>((__, xIdx) => ({
            elemId: nextElemId++,
            explicitState: 'open',
            matrix,
            visibleState: 'open',
            xIdx,
            yIdx
          }))
        )
      );
      return matrix;
    }
  }

  restart() {
    const gs = this.gameState$.value;
    if (gs) {
      this.restartCommon(gs);
      this.finalizeUpdate(gs);
    }
  }
  restoreGame() {
    const gs = this.gameState$.value;
    const savedGames: SavedGames = this.storageSvc.get(GameStateService.gameStatesCacheKey) || {};
    const savedGame = gs ? savedGames[gs.puzzleId] : undefined;
    if (gs && savedGame) {
      this.restartCommon(gs);
      gs.history = savedGames[gs.puzzleId]?.history || [];
      gs.history.forEach(x => {
        const elem = gs.elements.get(x.elemId)!;
        elem.explicitState = elem.visibleState = x.currentState;
      });
      gs.priorElapsedMs = savedGame.elapsedMs;
      gs.matrices.flat().forEach(x => this.setImpliedStates(x));
      this.validateGame(gs);
      this.finalizeUpdate(gs);
    }
  }
  /** Toggles an element to next available state. */
  toggleState(elemId: number) {
    const elem = this.gameState$.value?.elements.get(elemId);
    if (elem) {
      const nextIndex = (GameStateService.orderedStates.indexOf(elem.visibleState) + 1) % GameStateService.orderedStates.length;
      const nextState = GameStateService.orderedStates[nextIndex];
      this.updateState(elemId, nextState);
    }
  }

  /** Undos the latest item in history if it exists. */
  undoState() {
    const historyItem = this.gameState$.value?.history.pop();
    if (historyItem) {
      this.updateState(historyItem.elemId, historyItem.priorState, true);
    }
  }

  /** Updates an element's state and emits the change notification. */
  updateState(elemId: number, nextState: ElemStateValue, ignoreHistory?: boolean) {
    const gs = this.gameState$.value;
    const elem = gs?.elements.get(elemId);
    if (gs && elem) {
      const priorState = elem.explicitState;
      elem.explicitState = elem.visibleState = nextState;
      this.setImpliedStates(elem.matrix);
      this.validateGame(gs);
      if (!ignoreHistory) {
        gs.history.push({ currentState: nextState, elemId, priorState });
      }
      this.finalizeUpdate(gs);
    }
  }

  /** updates game validations. */
  validateGame(gs: GameState) {
    let hasErrors = false;
    gs.matrices.flat().forEach(m => {
      m.elems.flat().forEach(x => x.validationError = undefined);
      const dimensions = this.getMatrixCols(m).concat(m.elems);
      dimensions.forEach(dim => {
        const accepted = dim.filter(x => x.visibleState === 'accept');
        if (accepted.length >= 2) {
          accepted.forEach(x => x.validationError = 'multipleAccepted');
          hasErrors = true;
        }
        if (dim.every(x => x.visibleState === 'reject')) {
          dim.forEach(x => x.validationError = 'dimensionRejected');
          hasErrors = true;
        }
      });
    });
    gs.hasErrors = hasErrors;
  }
  validateMove(elemId: number, nextState: ElemStateValue): ValidationError | undefined {
    const elem = this.gameState$.value?.elements.get(elemId);
    if (elem) {
      const { col, row } = this.getSiblings(elem);
      switch (nextState) {
        case 'accept':
          if (col.some(x => x.visibleState === 'accept') || row.some(x => x.visibleState === 'accept')) {
            return 'multipleAccepted';
          }
          break;
        case 'reject':
          if (col.every(x => x.visibleState === 'reject') || row.every(x => x.visibleState === 'reject')) {
            return 'dimensionRejected';
          }
          break;
      }
    }
    return undefined;
  }

  private getMatrixCols(matrix: GameStateMatrix) {
    // since the matrix is a square, converting rows to cols is as simple as swapping indexes.
    return matrix.elems.map((row, yIdx) => row.map((_, xIdx) => matrix.elems[xIdx][yIdx]));
  }

  private getSiblings(elem: ElemState) {
    return {
      col: elem.matrix.elems.map(x => x[elem.xIdx]).filter(x => x.yIdx !== elem.yIdx),
      row: elem.matrix.elems[elem.yIdx].filter(x => x.xIdx !== elem.xIdx)
    };
  }

  private finalizeUpdate(gs: GameState) {
    this.saveGame();
    gs.action = 'update';
    this.gameState$.next(gs);
  }

  private restartCommon(gs: GameState) {
    gs.history.length = 0;
    gs.elements.forEach(x => {
      x.explicitState = x.visibleState = 'open';
      x.validationError = undefined;
    });
    gs.priorElapsedMs = 0;
    gs.sessionStart = new Date();
    gs.hasErrors = false;
  }
  private saveGame() {
    const gs = this.gameState$.value;
    if (gs) {
      const savedGames: SavedGames = this.storageSvc.get(GameStateService.gameStatesCacheKey) || {};
      const elapsedMs = gs.priorElapsedMs + (new Date().valueOf() - gs.sessionStart.valueOf());
      savedGames[gs.puzzleId] = { elapsedMs, history: gs.history, puzzleId: gs.puzzleId };
      this.storageSvc.set(GameStateService.gameStatesCacheKey, savedGames);
    }
  }

  /** Sets visibleStates on items in matrix that are open. */
  private setImpliedStates(matrix: GameStateMatrix) {
    matrix.elems.flat().filter(x => x.explicitState === 'open')
      .forEach(x => {
        const { col, row } = this.getSiblings(x);
        x.visibleState = col.concat(row).some(y => y.visibleState === 'accept') ? 'reject' : 'open';
      });
  }
}
