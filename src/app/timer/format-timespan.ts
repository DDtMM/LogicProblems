
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
const tokenizer = new RegExp(`\\\\.|${orderedTimeConfig.map(x => `${x.symbol}+\\??`).join('|')}|.+?`, 'g');


/** formats milliseconds as a time
 * h = hours, m = minutes, s = seconds, S = milliseconds.
 * Repeating a symbol will control length.  for example mm will be two digits (if there is an hour).
 * Append ? char to make the part optional.
 * Delimiters will only be added if time part is in front (like thousands seperators).
 */
export function formatTimespan(timespanMs: number, format: string) {
  const formatParts = parseFormat(format);
  // keep track if a time part has been added.  Once one has the rest are no longer optional.
  let hasAddedTimePart = false;
  // keep track if the last static part ends in white space.  Effects if the next part should be full length.
  let endsInWhiteSpace = true;
  return formatParts.map(fp => {
    if (typeof fp === 'string') {
      // only add static content if a time part has been added.
      // The reason is because the static parts are supposed to be delimiters
      if (hasAddedTimePart) {
        endsInWhiteSpace = /\s$/.test(fp);
        return fp;
      }
      else {
        endsInWhiteSpace = true;
        return '';
      }
    }
    const totalValue = Math.floor(timespanMs / fp.config.base);
    const value = (fp.config.limit) ? totalValue % fp.config.limit : totalValue;
    if (hasAddedTimePart || value !== 0 || !fp.optional) {
      const length = (fp.config.length && hasAddedTimePart && !endsInWhiteSpace) ? fp.config.length : fp.length;
      hasAddedTimePart = true;
      return value.toString().padStart(length, '0');
    }
    return '';
  }).join('');
}

interface FormatPart {
  config: TimeConfigItemCalculated;
  length: number;
  optional: boolean;
}

function parseFormat(format: string) {
  const tokens = tokenize(format);
  return Array.from(tokens)
    .map(x => {
      if (x.type === 'static') {
        return x.content;
      }
      const optional = x.symbol.endsWith('?');
      return {
        config: x.config,
        length: x.symbol.length - (optional ? 1 : 0),
        optional
      } as FormatPart;
    });
}

/** Uses tokenizer to create tokens. */
function* tokenize(format: string) {
  interface StaticToken {
    content: string;
    type: 'static';
  }
  interface TimePartToken {
    config: TimeConfigItemCalculated;
    symbol: string;
    type: 'timepart';
  }

  let match: RegExpExecArray | null;
  // reset tokenizer.
  tokenizer.lastIndex = 0;
  while ((match = tokenizer.exec(format)) !== null) {
    const symbol = match[0];
    if (symbol[0] === '\\') {
      yield { content: symbol.substring(1), type: 'static' } as StaticToken;
    }
    else if (symbolMap.has(symbol[0])) {
      yield { config: symbolMap.get(symbol[0])!, symbol, type: 'timepart' } as TimePartToken;
    }
    else {
      yield { content: symbol, type: 'static' } as StaticToken;
    }
  }
}
