import { InjectionToken } from '@angular/core';

export interface PuzzleConfigItem {
  label: string;
  path: string;
}

export const PUZZLES = new InjectionToken<PuzzleConfigItem[]>('Puzzle configuration info',
  {
    factory: () => [
      { label: 'Cookies', path: '/assets/puzzles/sample1.json' },
      { label: 'Small', path: '/assets/puzzles/sampleSmall.json' }
    ]
  }
);
