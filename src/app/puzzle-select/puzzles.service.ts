import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProblemDef } from '../models/problem-def';

interface PuzzleInfo {
  def$: Observable<ProblemDef>;
  label: string;
  path: string;
}
@Injectable({
  providedIn: 'root'
})
export class PuzzlesService {
  /** Currenlty hard coded puzzles */
  readonly puzzles: PuzzleInfo[] = [
    this.createPuzzleInfo('Cookies', '/assets/puzzles/sample1.json'),
    this.createPuzzleInfo('Small', '/assets/puzzles/sampleSmall.json' ),
  ];
  constructor(private http: HttpClient) { }

  private createPuzzleInfo(label: string, path: string): PuzzleInfo {
    const def$ = this.http.get<ProblemDef>(path, { responseType: 'json' }).pipe(
      shareReplay(1)
    );
    return { def$, label, path };
  }
}
