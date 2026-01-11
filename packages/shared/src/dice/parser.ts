/**
 * Dice expression parser
 * Parses dice notation like "1d20", "2d6", "d20" (implicit 1)
 * Supports modifiers: "1d20+5", "2d6-2"
 * Supports keep highest/lowest: "2d20kh1", "4d6kh3", "2d20kl1"
 */

/**
 * Keep mode for dice expressions
 */
export type KeepMode = 'highest' | 'lowest';

/**
 * Represents a parsed dice expression
 */
export interface ParsedDice {
  /** Number of dice to roll */
  count: number;
  /** Number of sides on each die */
  sides: number;
  /** Modifier to add to the total (default: 0) */
  modifier: number;
  /** Keep mode: 'highest' or 'lowest' (undefined if not using keep) */
  keep?: KeepMode;
  /** Number of dice to keep (only set if keep is defined) */
  keepCount?: number;
}

/**
 * Error thrown when a dice expression cannot be parsed
 */
export class DiceParseError extends Error {
  readonly expression: string;

  constructor(message: string, expression: string) {
    super(message);
    this.name = 'DiceParseError';
    this.expression = expression;
  }
}

/**
 * Regular expression for parsing dice notation: NdS or dS with optional keep and modifier
 * - N: optional count (defaults to 1 if omitted)
 * - d: literal 'd' separator (case insensitive)
 * - S: number of sides (required)
 * - kh/kl: optional keep highest/lowest (case insensitive)
 * - K: number to keep (required if kh/kl present)
 * - +/-M: optional modifier (e.g., +5, -2)
 */
const DICE_REGEX = /^(\d*)d(\d+)(?:(kh|kl)(\d+))?([+-]\d+)?$/i;

/**
 * Parses a dice expression in NdS format with optional keep and modifier
 *
 * @param expression - The dice expression to parse (e.g., "1d20", "2d6+3", "2d20kh1")
 * @returns The parsed dice with count, sides, modifier, and optional keep info
 * @throws {DiceParseError} If the expression is invalid
 *
 * @example
 * parseDice("1d20")    // { count: 1, sides: 20, modifier: 0 }
 * parseDice("2d6")     // { count: 2, sides: 6, modifier: 0 }
 * parseDice("d20")     // { count: 1, sides: 20, modifier: 0 }
 * parseDice("1d20+5")  // { count: 1, sides: 20, modifier: 5 }
 * parseDice("2d6-2")   // { count: 2, sides: 6, modifier: -2 }
 * parseDice("2d20kh1") // { count: 2, sides: 20, modifier: 0, keep: 'highest', keepCount: 1 }
 * parseDice("2d20kl1") // { count: 2, sides: 20, modifier: 0, keep: 'lowest', keepCount: 1 }
 * parseDice("4d6kh3")  // { count: 4, sides: 6, modifier: 0, keep: 'highest', keepCount: 3 }
 */
export function parseDice(expression: string): ParsedDice {
  if (!expression || typeof expression !== 'string') {
    throw new DiceParseError('Expression must be a non-empty string', String(expression));
  }

  // Remove whitespace
  const trimmed = expression.trim();

  if (trimmed.length === 0) {
    throw new DiceParseError('Expression cannot be empty', expression);
  }

  const match = trimmed.match(DICE_REGEX);

  if (!match) {
    throw new DiceParseError(
      `Invalid dice expression: "${trimmed}". Expected format: NdS, NdS+M, or NdSkhK (e.g., 1d20, 2d6+3, 2d20kh1)`,
      expression
    );
  }

  const countStr = match[1] ?? '';
  const sidesStr = match[2] ?? '';
  const keepModeStr = match[3] ?? '';
  const keepCountStr = match[4] ?? '';
  const modifierStr = match[5] ?? '';

  // Default count to 1 if not specified (e.g., "d20" -> 1d20)
  const count = countStr === '' ? 1 : parseInt(countStr, 10);
  const sides = parseInt(sidesStr, 10);
  // Default modifier to 0 if not specified
  const modifier = modifierStr === '' ? 0 : parseInt(modifierStr, 10);

  // Parse keep mode if present
  let keep: KeepMode | undefined;
  let keepCount: number | undefined;

  if (keepModeStr) {
    keep = keepModeStr.toLowerCase() === 'kh' ? 'highest' : 'lowest';
    keepCount = parseInt(keepCountStr, 10);
  }

  // Validate count
  if (count < 1) {
    throw new DiceParseError(
      `Invalid dice count: ${count}. Must be at least 1`,
      expression
    );
  }

  if (count > 100) {
    throw new DiceParseError(
      `Invalid dice count: ${count}. Maximum is 100 dice`,
      expression
    );
  }

  // Validate sides
  if (sides < 1) {
    throw new DiceParseError(
      `Invalid number of sides: ${sides}. Must be at least 1`,
      expression
    );
  }

  if (sides > 1000) {
    throw new DiceParseError(
      `Invalid number of sides: ${sides}. Maximum is 1000`,
      expression
    );
  }

  // Validate keepCount if present
  if (keepCount !== undefined) {
    if (keepCount < 1) {
      throw new DiceParseError(
        `Invalid keep count: ${keepCount}. Must be at least 1`,
        expression
      );
    }

    if (keepCount > count) {
      throw new DiceParseError(
        `Invalid keep count: ${keepCount}. Cannot keep more dice than rolled (${count})`,
        expression
      );
    }
  }

  // Build result object
  const result: ParsedDice = { count, sides, modifier };

  if (keep !== undefined && keepCount !== undefined) {
    result.keep = keep;
    result.keepCount = keepCount;
  }

  return result;
}
