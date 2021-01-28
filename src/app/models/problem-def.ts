export type IdType = string | number;

export interface ProblemCategory {
  categoryId: IdType;
  items: ProblemItem[];
  /** Category label. */
  label: string;
}


export interface ProblemItem {
  label: string;
  solutionGroupId: IdType;
}

/**
 * Clues to help solve the problem.
 * At this point it's just the clue content, though in the future it could contain information on what the clue eliminates.
 */
export interface ProblemClue {
  /** Either a string, or array of strings that can be crossed out. */
  spans: ProblemClueSpan[];
}

export interface ProblemClueSpan {
  /** content of the span. */
  content: string;
}

export interface ProblemDef {
  categories: ProblemCategory[];
  clues: ProblemClue[];
}
