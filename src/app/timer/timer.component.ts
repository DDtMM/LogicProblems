import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, defer, interval, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { formatTimespan } from './format-timespan';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styles: [
  ]
})
export class TimerComponent implements OnInit, OnDestroy {
  private static readonly timeParts = [
    { partBase: 1000, partLimit: 60, requireDelimiter: true  },
    { partBase: 60000, partLimit: 60 },
    { partBase: 3600000 }
  ];

  @Input()
  set elapsedMs(value: number) {
    if (!isNaN(value)) {
      this.elapsedMsSubject.next(value);
    }
  }

  readonly time$ = defer(() => this.elapsedMsSubject).pipe(
    switchMap(initialTime => {
      const start = new Date().valueOf() - initialTime;
      return interval(1000).pipe(
        map(() => new Date().valueOf() - start),
        startWith(initialTime)
      );
    }),
    map(totalTime => formatTimespan(totalTime, 'h:m!:ss')),
  );

  private destroyedSubject = new Subject();
  private elapsedMsSubject = new BehaviorSubject(0);

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    interval(1000).pipe(
      takeUntil(this.destroyedSubject),
      tap(x => {
        this.elapsedMs += x;
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyedSubject.next();
  }
}
