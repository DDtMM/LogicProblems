import { IdType } from './id-type';
import { ProblemItem } from './problem-item';

export interface ProblemCategory {
  categoryId: IdType;
  items: ProblemItem[];
  /** Category label. */
  label: string;
}
