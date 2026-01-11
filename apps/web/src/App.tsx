import { useState } from 'react';
import { SHARED_VERSION, type RollResult } from '@duragon/shared';
import { DiceInput, DiceResult, DicePresets } from './components/dice';
import { AppLayout, type NavItem } from './components/layout';
import { Button, useToast } from './components/ui';

interface RollEntry {
  result: RollResult;
  timestamp: Date;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'characters',
    label: 'Characters',
    href: '/characters',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'rooms',
    label: 'Rooms',
    href: '/rooms',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'dice',
    label: 'Dice Roller',
    href: '/dice',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

function App() {
  const [rolls, setRolls] = useState<RollEntry[]>([]);
  const [activeNav, setActiveNav] = useState('dice');
  const { success, error, info, warning } = useToast();

  const handleRoll = (result: RollResult) => {
    setRolls((prev) => [{ result, timestamp: new Date() }, ...prev].slice(0, 10));
  };

  const handleNavClick = (item: NavItem) => {
    setActiveNav(item.id);
  };

  return (
    <AppLayout
      navItems={navItems}
      activeNavId={activeNav}
      onNavClick={handleNavClick}
      userName="Demo User"
      onSignOut={() => info('Sign out clicked')}
      onSignIn={() => info('Sign in clicked')}
    >
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Dice Roller</h1>
        <p className="text-gray-400 text-sm mb-6">
          D&D Companion v{SHARED_VERSION}
        </p>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Toast Demo</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => success('Action completed!')}>
              Success
            </Button>
            <Button size="sm" variant="danger" onClick={() => error('Something went wrong')}>
              Error
            </Button>
            <Button size="sm" variant="secondary" onClick={() => info('Here is some info')}>
              Info
            </Button>
            <Button size="sm" variant="ghost" onClick={() => warning('Be careful!')}>
              Warning
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Roll Dice</h2>
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
    </AppLayout>
  );
}

export default App;
