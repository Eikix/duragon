import { useState, useCallback, type FormEvent, type KeyboardEvent } from 'react';
import { parseDice, roll, DiceParseError, type RollResult } from '@duragon/shared';

export interface DiceInputProps {
  /** Callback fired when a roll is successfully executed */
  onRoll?: (result: RollResult) => void;
  /** Whether to clear the input after a successful roll */
  clearOnRoll?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Input component for dice expressions
 * Validates and rolls dice expressions like "1d20", "2d6+3", "2d20kh1"
 */
export function DiceInput({
  onRoll,
  clearOnRoll = false,
  placeholder = 'e.g., 1d20, 2d6+3, 2d20kh1',
  disabled = false,
}: DiceInputProps) {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRoll = useCallback(() => {
    const trimmed = expression.trim();
    if (!trimmed) {
      setError('Please enter a dice expression');
      return;
    }

    try {
      const parsed = parseDice(trimmed);
      const result = roll(parsed);
      setError(null);

      if (clearOnRoll) {
        setExpression('');
      }

      onRoll?.(result);
    } catch (err) {
      if (err instanceof DiceParseError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  }, [expression, clearOnRoll, onRoll]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handleRoll();
    },
    [handleRoll]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRoll();
      }
    },
    [handleRoll]
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-label="Dice expression"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'dice-input-error' : undefined}
            className={`w-full px-3 py-2 rounded-md border bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 hover:border-gray-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          Roll
        </button>
      </form>
      {error && (
        <p id="dice-input-error" className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
