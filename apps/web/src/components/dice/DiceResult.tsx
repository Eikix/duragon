import type { RollResult } from '@duragon/shared';

export interface DiceResultProps {
  /** The roll result to display */
  result: RollResult;
  /** Optional label for the roll (e.g., "Attack", "Damage") */
  label?: string;
  /** Name of the person who rolled */
  rollerName?: string;
  /** Timestamp of when the roll occurred */
  timestamp?: Date;
}

/**
 * Formats a dice expression from a RollResult for display
 */
function formatDiceExpression(result: RollResult): string {
  const { dice } = result;
  let expr = `${dice.count}d${dice.sides}`;

  if (dice.keep !== undefined && dice.keepCount !== undefined) {
    expr += `k${dice.keep === 'highest' ? 'h' : 'l'}${dice.keepCount}`;
  }

  if (dice.drop !== undefined && dice.dropCount !== undefined) {
    expr += `d${dice.drop === 'highest' ? 'h' : 'l'}${dice.dropCount}`;
  }

  if (dice.modifier !== 0) {
    expr += dice.modifier > 0 ? `+${dice.modifier}` : `${dice.modifier}`;
  }

  return expr;
}

/**
 * Formats a timestamp for display
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Component for displaying a dice roll result
 * Shows individual dice, kept/dropped status, modifiers, and total
 */
export function DiceResult({
  result,
  label,
  rollerName,
  timestamp,
}: DiceResultProps) {
  const expression = formatDiceExpression(result);
  const hasDroppedDice = result.rolls.some((die) => !die.kept);

  return (
    <div className="p-4 bg-gray-700 rounded-md">
      {/* Header with label, expression, and metadata */}
      <div className="flex items-start justify-between mb-2">
        <div>
          {label && (
            <span className="text-sm font-medium text-blue-400 mr-2">
              {label}
            </span>
          )}
          <span className="text-sm text-gray-400 font-mono">{expression}</span>
        </div>
        {(rollerName || timestamp) && (
          <div className="text-xs text-gray-500 text-right">
            {rollerName && <div>{rollerName}</div>}
            {timestamp && <div>{formatTimestamp(timestamp)}</div>}
          </div>
        )}
      </div>

      {/* Individual dice */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {result.rolls.map((die, index) => (
          <span
            key={index}
            className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-mono ${
              die.kept
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-400 line-through'
            }`}
            title={die.kept ? 'Kept' : 'Dropped'}
          >
            {die.value}
          </span>
        ))}
        {result.modifier !== 0 && (
          <span className="text-gray-300 font-mono">
            {result.modifier > 0 ? '+' : ''}
            {result.modifier}
          </span>
        )}
      </div>

      {/* Total */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-green-400">
          {result.total}
        </span>
        {hasDroppedDice && result.modifier === 0 && (
          <span className="text-xs text-gray-500">
            ({result.rolls.filter((d) => d.kept).map((d) => d.value).join(' + ')})
          </span>
        )}
        {hasDroppedDice && result.modifier !== 0 && (
          <span className="text-xs text-gray-500">
            ({result.rolls.filter((d) => d.kept).map((d) => d.value).join(' + ')} {result.modifier > 0 ? '+' : ''}{result.modifier})
          </span>
        )}
        {!hasDroppedDice && result.rolls.length > 1 && result.modifier !== 0 && (
          <span className="text-xs text-gray-500">
            ({result.subtotal} {result.modifier > 0 ? '+' : ''}{result.modifier})
          </span>
        )}
      </div>
    </div>
  );
}
