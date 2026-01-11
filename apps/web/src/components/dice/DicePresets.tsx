import { useCallback } from 'react';
import { parseDice, roll, type RollResult } from '@duragon/shared';

export interface DicePreset {
  /** Display label for the button */
  label: string;
  /** Dice expression to roll */
  expression: string;
  /** Optional description shown on hover */
  description?: string;
}

export interface DicePresetsProps {
  /** Callback fired when a preset is rolled */
  onRoll?: (result: RollResult) => void;
  /** Whether the buttons are disabled */
  disabled?: boolean;
  /** Custom presets to use instead of defaults */
  presets?: DicePreset[];
}

/** Default presets for common D&D dice */
const DEFAULT_PRESETS: DicePreset[] = [
  { label: 'd20', expression: '1d20', description: 'Standard d20 roll' },
  { label: 'd12', expression: '1d12', description: 'Roll a d12' },
  { label: 'd10', expression: '1d10', description: 'Roll a d10' },
  { label: 'd8', expression: '1d8', description: 'Roll a d8' },
  { label: 'd6', expression: '1d6', description: 'Roll a d6' },
  { label: 'd4', expression: '1d4', description: 'Roll a d4' },
  { label: 'Adv', expression: '2d20kh1', description: 'Roll with advantage (2d20 keep highest)' },
  { label: 'Dis', expression: '2d20kl1', description: 'Roll with disadvantage (2d20 keep lowest)' },
];

/**
 * Quick preset buttons for common dice rolls
 * Includes standard dice (d20, d12, d10, d8, d6, d4) and advantage/disadvantage
 */
export function DicePresets({
  onRoll,
  disabled = false,
  presets = DEFAULT_PRESETS,
}: DicePresetsProps) {
  const handlePresetClick = useCallback(
    (expression: string) => {
      const parsed = parseDice(expression);
      const result = roll(parsed);
      onRoll?.(result);
    },
    [onRoll]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.expression}
          type="button"
          onClick={() => handlePresetClick(preset.expression)}
          disabled={disabled}
          title={preset.description}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            disabled
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600 active:bg-gray-500'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
