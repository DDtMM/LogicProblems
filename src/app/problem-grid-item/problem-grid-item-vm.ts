import { ProblemItem } from '../models/problem-item';

export type ProblemGridItemVmState = 'accept' | 'exclude' | 'open';

export interface ProblemGridItemVm {
  itemX: ProblemItem;
  itemY: ProblemItem;
  state: ProblemGridItemVmState;
}
