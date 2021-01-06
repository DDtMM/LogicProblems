import { ProblemItem } from '../models/problem-item';

export type ProblemGridItemVmState = 'accept' | 'open' | 'reject';

export interface ProblemGridItemVm {
  itemX: ProblemItem;
  itemY: ProblemItem;
  state: ProblemGridItemVmState;
}
