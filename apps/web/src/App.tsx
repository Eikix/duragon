import { useState } from 'react';
import { SHARED_VERSION, type RollResult } from '@duragon/shared';
import { DiceInput, DiceResult, DicePresets } from './components/dice';

interface RollEntry {
  result: RollResult;
  timestamp: Date;
}

function App() {
  const [rolls, setRolls] = useState<RollEntry[]>([]);

  const handleRoll = (result: RollResult) => {
    setRolls((prev) => [{ result, timestamp: new Date() }, ...prev].slice(0, 10));
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
          <div className="mt-3">
            <DicePresets onRoll={handleRoll} />
          </div>

          {rolls.length > 0 && (
            <div className="mt-4 space-y-3">
              {rolls.map((entry, index) => (
                <DiceResult
                  key={`${entry.timestamp.getTime()}-${index}`}
                  result={entry.result}
                  timestamp={entry.timestamp}
                  rollerName="You"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
