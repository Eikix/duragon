/**
 * Dice roller using cryptographically secure random number generation
 */

import type { ParsedDice } from './parser';

/**
 * Result of a single die roll
 */
export interface DieResult {
  /** The value rolled (1 to sides) */
  value: number;
  /** Whether this die was kept (true) or dropped (false) */
  kept: boolean;
}

/**
 * Result of rolling dice
 */
export interface RollResult {
  /** The original parsed dice expression */
  dice: ParsedDice;
  /** Individual die results in roll order */
  rolls: DieResult[];
  /** Sum of kept dice values */
  subtotal: number;
  /** Modifier applied to the roll */
  modifier: number;
  /** Final total (subtotal + modifier) */
  total: number;
}

/**
 * Generates a cryptographically secure random integer in the range [1, max]
 * Uses rejection sampling to ensure uniform distribution
 *
 * @param max - The maximum value (inclusive), must be >= 1
 * @returns A random integer between 1 and max (inclusive)
 */
function secureRandomInt(max: number): number {
  if (max < 1) {
    throw new Error('max must be at least 1');
  }

  if (max === 1) {
    return 1;
  }

  // Use Uint32Array for crypto random values
  const array = new Uint32Array(1);

  // Calculate the maximum value we can use for uniform distribution
  // This uses rejection sampling to avoid modulo bias
  const maxUint32 = 0xFFFFFFFF;
  const limit = maxUint32 - (maxUint32 % max);

  let randomValue: number;
  do {
    crypto.getRandomValues(array);
    randomValue = array[0]!;
  } while (randomValue >= limit);

  // Return value in range [1, max]
  return (randomValue % max) + 1;
}

/**
 * Rolls a single die with the given number of sides
 *
 * @param sides - Number of sides on the die
 * @returns A random value between 1 and sides (inclusive)
 */
export function rollDie(sides: number): number {
  return secureRandomInt(sides);
}

/**
 * Rolls multiple dice and returns the individual results
 *
 * @param count - Number of dice to roll
 * @param sides - Number of sides on each die
 * @returns Array of rolled values
 */
export function rollDice(count: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(sides));
  }
  return results;
}

/**
 * Executes a dice roll from a parsed dice expression
 * Handles keep/drop logic and modifiers
 *
 * @param dice - The parsed dice expression
 * @returns The complete roll result with individual dice and total
 *
 * @example
 * // Simple roll
 * roll(parseDice("2d6")) // { rolls: [{value: 3, kept: true}, {value: 5, kept: true}], subtotal: 8, modifier: 0, total: 8 }
 *
 * // Roll with modifier
 * roll(parseDice("1d20+5")) // { rolls: [{value: 15, kept: true}], subtotal: 15, modifier: 5, total: 20 }
 *
 * // Roll with keep highest (advantage)
 * roll(parseDice("2d20kh1")) // { rolls: [{value: 7, kept: false}, {value: 18, kept: true}], subtotal: 18, modifier: 0, total: 18 }
 *
 * // Roll with drop lowest (stat roll)
 * roll(parseDice("4d6dl1")) // { rolls: [{value: 3, kept: false}, {value: 4, kept: true}, {value: 5, kept: true}, {value: 6, kept: true}], subtotal: 15, modifier: 0, total: 15 }
 */
export function roll(dice: ParsedDice): RollResult {
  // Roll all the dice
  const rawRolls = rollDice(dice.count, dice.sides);

  // Determine which dice to keep
  const keptIndices = new Set<number>();

  if (dice.keep !== undefined && dice.keepCount !== undefined) {
    // Keep highest or lowest
    const indexed = rawRolls.map((value, index) => ({ value, index }));

    if (dice.keep === 'highest') {
      // Sort descending and take first N
      indexed.sort((a, b) => b.value - a.value);
    } else {
      // Sort ascending and take first N
      indexed.sort((a, b) => a.value - b.value);
    }

    for (let i = 0; i < dice.keepCount; i++) {
      keptIndices.add(indexed[i]!.index);
    }
  } else if (dice.drop !== undefined && dice.dropCount !== undefined) {
    // Drop highest or lowest (keep the rest)
    const indexed = rawRolls.map((value, index) => ({ value, index }));

    if (dice.drop === 'highest') {
      // Sort descending, drop first N (keep the rest)
      indexed.sort((a, b) => b.value - a.value);
    } else {
      // Sort ascending, drop first N (keep the rest)
      indexed.sort((a, b) => a.value - b.value);
    }

    // Add all indices except the first dropCount
    for (let i = dice.dropCount; i < indexed.length; i++) {
      keptIndices.add(indexed[i]!.index);
    }
  } else {
    // Keep all dice
    for (let i = 0; i < rawRolls.length; i++) {
      keptIndices.add(i);
    }
  }

  // Build roll results with kept status
  const rolls: DieResult[] = rawRolls.map((value, index) => ({
    value,
    kept: keptIndices.has(index),
  }));

  // Calculate subtotal from kept dice
  const subtotal = rolls
    .filter((r) => r.kept)
    .reduce((sum, r) => sum + r.value, 0);

  // Calculate final total with modifier
  const total = subtotal + dice.modifier;

  return {
    dice,
    rolls,
    subtotal,
    modifier: dice.modifier,
    total,
  };
}
