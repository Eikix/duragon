import { useState } from 'react';
import { SHARED_VERSION, type RollResult } from '@duragon/shared';
import { DiceInput } from './components/dice';

function App() {
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  const handleRoll = (result: RollResult) => {
    setLastRoll(result);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Duragon</h1>
        <p className="text-gray-400 text-sm mb-8">
          D&D Companion v{SHARED_VERSION}
        </p>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Dice Roller</h2>
          <DiceInput onRoll={handleRoll} />

          {lastRoll && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md">
              <div className="text-sm text-gray-400 mb-1">
                {lastRoll.dice.count}d{lastRoll.dice.sides}
                {lastRoll.dice.keep && `k${lastRoll.dice.keep === 'highest' ? 'h' : 'l'}${lastRoll.dice.keepCount}`}
                {lastRoll.dice.drop && `d${lastRoll.dice.drop === 'highest' ? 'h' : 'l'}${lastRoll.dice.dropCount}`}
                {lastRoll.modifier !== 0 && (lastRoll.modifier > 0 ? `+${lastRoll.modifier}` : lastRoll.modifier)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {lastRoll.rolls.map((die, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-mono ${
                      die.kept
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-400 line-through'
                    }`}
                  >
                    {die.value}
                  </span>
                ))}
                {lastRoll.modifier !== 0 && (
                  <span className="text-gray-300">
                    {lastRoll.modifier > 0 ? '+' : ''}{lastRoll.modifier}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-green-400">
                Total: {lastRoll.total}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
