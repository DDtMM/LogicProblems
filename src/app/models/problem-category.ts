import { ProblemItem } from './problem-item';

export interface ProblemCategory {
  items: ProblemItem[];
  /** Category label. */
  label: string;
}
