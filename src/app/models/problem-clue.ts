/**
 * Clues to help solve the problem.
 * At this point it's just the clue content, though in the future it could contain information on what the clue eliminates.
 */
export interface ProblemClue {
  /** Either a string, or array of strings that can be crossed out. */
  content: string | string[];
}
