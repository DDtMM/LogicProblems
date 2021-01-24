
interface TimeConfigItem {
  /** The number of ms per unit of this part. */
  base: number;
  /** The symbol that seperates this item from the previous */
  delim?: string;
  /** The maximum value that can be reached. */
  max?: number;
  /** The symbol to look for when formatting. */
  symbol: string;
}
interface TimeConfigItemCalculated extends TimeConfigItem {
  /** The value that can't be reached (for modulo) */
  limit?: number;
  /** Max number of digits for item. */
  length?: number;
}
/** Time parts ordered  */
const orderedTimeConfig: TimeConfigItemCalculated[] = ([
  { base: 3600000, symbol: 'h' }, // hours
  { delim: ':', length: 2, base: 60000, max: 59, symbol: 'm' }, // minutes
  { delim: ':', length: 2, base: 1000, max: 59, symbol: 's' }, // seconds
  { delim: '.', length: 3, base: 1, max: 999, symbol: 'S' } // milliseconds
] as TimeConfigItem[]).map(x => ({
  ...x,
  limit: x.max ? x.max + 1 : undefined,
  length: x.max?.toString()?.length
}));

/** orderedConfig mapped to symbols. */
const symbolMap = new Map(orderedTimeConfig.map(x => [x.symbol, x]));
/** finds tokens in format string. */
const tokenizer = new RegExp(`\\\\.|${orderedTimeConfig.map(x => `${x.symbol}+\\??`).join('|')}|!|.+?`, 'g');


/** formats milliseconds as a time
 * h = hours, m = minutes, s = seconds, S = milliseconds.
 * Repeating a symbol will control length.  for example mm will be two digits (if there is an hour).
 * Anything that follows a ! is required.
 * Delimiters will only be added if time part is in front (like thousands seperators).
 */
export function formatTimespan(timespanMs: number, format: string) {
  const formatParts = parseFormat(format);
  // If a time part has been added, the all the rest are no longer optional.
  let allForwardAreRequired = false;
  // keep track if the last static part ends in white space.  Effects if the next part should be full length.
  let endsInWhiteSpace = true;
  return formatParts.map(fp => {
    if (fp.type === 'static') {
      // only add static content if a time part has been added.
      // The reason is because the static parts are supposed to be delimiters
      if (allForwardAreRequired || !fp.optional) {
        endsInWhiteSpace = /\s$/.test(fp.content);
        allForwardAreRequired = true; // once an item is added then all forward items are required.
        return fp.content;
      }
      else {
        endsInWhiteSpace = true;
        return '';
      }
    }
    else {
      const totalValue = Math.floor(timespanMs / fp.config.base);
      const value = (fp.config.limit) ? totalValue % fp.config.limit : totalValue;
      if (allForwardAreRequired || value !== 0 || !fp.optional) {
        const length = (fp.config.length && allForwardAreRequired && !endsInWhiteSpace) ? fp.config.length : fp.length;
        allForwardAreRequired = true; // once an item is added then all forward items are required.
        return value.toString().padStart(length, '0');
      }
    }
    return '';
  }).join('');
}

interface FormatTimePart {
  config: TimeConfigItemCalculated;
  length: number;
  optional: boolean;
  type: 'time';
}
interface FormatStaticPart {
  content: string;
  optional: boolean;
  type: 'static';
}

function parseFormat(format: string): (FormatTimePart | FormatStaticPart)[] {
  const tokens = tokenize(format);
  let isOptional = true;
  return Array.from(tokens)
    .map(x => {
      switch (x.type) {
        case 'static':
          return { content: x.content, optional: isOptional, type: 'static' } as FormatStaticPart;
        case 'required':
          isOptional = false;
          return undefined;
        case 'timepart':
          return {
            config: x.config,
            length: x.symbol.length,
            optional: isOptional,
            type: 'time'
          } as FormatTimePart;
      }
    })
    .filter((x): x is FormatTimePart | FormatStaticPart => x != null); // remove empty results
}
interface RequiredToken {
  type: 'required';
}
interface StaticToken {
  content: string;
  type: 'static';
}
interface TimePartToken {
  config: TimeConfigItemCalculated;
  symbol: string;
  type: 'timepart';
}
/** Uses tokenizer to create tokens. */
function* tokenize(format: string): Generator<RequiredToken | StaticToken | TimePartToken> {
  let match: RegExpExecArray | null;
  // reset tokenizer.
  tokenizer.lastIndex = 0;
  while ((match = tokenizer.exec(format)) !== null) {
    const symbol = match[0];
    const firstChar = symbol[0];
    if (firstChar === '\\') {
      yield { content: symbol.substring(1), type: 'static' };
    }
    else if (symbolMap.has(firstChar)) {
      yield { config: symbolMap.get(firstChar)!, symbol, type: 'timepart' };
    }
    else if (firstChar === '!') {
      yield { type: 'required' } as RequiredToken;
      if (symbol.length > 1) {
        yield { content: symbol.substring(0, symbol.length - 1), type: 'static' };
      }
    }
    else {
      yield { content: symbol, type: 'static' };
    }
  }
}
