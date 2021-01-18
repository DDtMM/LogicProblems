import { TestBed } from '@angular/core/testing';

import { PuzzleGuard } from './puzzle.guard';

describe('PuzzleGuard', () => {
  let guard: PuzzleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PuzzleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
