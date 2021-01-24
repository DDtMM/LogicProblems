import { ProblemDef } from './app/models/problem-def';

declare module '*.lp.json' {
  const value: ProblemDef;
  export default value;
}
