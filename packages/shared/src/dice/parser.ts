/**
 * Dice expression parser
 * Parses dice notation like "1d20", "2d6", "d20" (implicit 1)
 * Supports modifiers: "1d20+5", "2d6-2"
 */

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
 * Regular expression for parsing dice notation: NdS or dS with optional modifier
 * - N: optional count (defaults to 1 if omitted)
 * - d: literal 'd' separator (case insensitive)
 * - S: number of sides (required)
 * - +/-M: optional modifier (e.g., +5, -2)
 */
const DICE_REGEX = /^(\d*)d(\d+)([+-]\d+)?$/i;

/**
 * Parses a dice expression in NdS format with optional modifier
 *
 * @param expression - The dice expression to parse (e.g., "1d20", "2d6+3", "d20-1")
 * @returns The parsed dice with count, sides, and modifier
 * @throws {DiceParseError} If the expression is invalid
 *
 * @example
 * parseDice("1d20")   // { count: 1, sides: 20, modifier: 0 }
 * parseDice("2d6")    // { count: 2, sides: 6, modifier: 0 }
 * parseDice("d20")    // { count: 1, sides: 20, modifier: 0 }
 * parseDice("1d20+5") // { count: 1, sides: 20, modifier: 5 }
 * parseDice("2d6-2")  // { count: 2, sides: 6, modifier: -2 }
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
      `Invalid dice expression: "${trimmed}". Expected format: NdS or NdS+M (e.g., 1d20, 2d6+3, d20-1)`,
      expression
    );
  }

  const countStr = match[1] ?? '';
  const sidesStr = match[2] ?? '';
  const modifierStr = match[3] ?? '';

  // Default count to 1 if not specified (e.g., "d20" -> 1d20)
  const count = countStr === '' ? 1 : parseInt(countStr, 10);
  const sides = parseInt(sidesStr, 10);
  // Default modifier to 0 if not specified
  const modifier = modifierStr === '' ? 0 : parseInt(modifierStr, 10);

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

  return { count, sides, modifier };
}
