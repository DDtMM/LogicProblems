import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProblemDef } from '../models/problem-def';
import { PuzzleConfigItem, PUZZLES } from './puzzles-config';

interface PuzzleInfo extends PuzzleConfigItem {
  def$: Observable<ProblemDef>;
}

@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {
  /** Currenlty hard coded puzzles */
  readonly puzzles: PuzzleInfo[];

  constructor(private http: HttpClient, @Inject(PUZZLES) puzzleConfig: PuzzleConfigItem[]) {
    this.puzzles = puzzleConfig.map(x => ({
      def$: this.http.get<ProblemDef>(x.path, { responseType: 'json' }).pipe(shareReplay(1)),
      label: x.label,
      path: x.path,
    }));
  }

}
