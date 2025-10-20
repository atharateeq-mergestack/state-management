'use client';

import { useState } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function UseHydrationDemo() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydratedData, setHydratedData] = useState<Partial<DemoState>>({});

  // Subscribe to state to see hydration effects
  const { user, counter, theme, settings } = stateController.useState(['user', 'counter', 'theme', 'settings']);

  // Simulate server-side data that would be hydrated
  const serverData: Partial<DemoState> = {
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28,
    },
    counter: 42,
    theme: 'dark',
    settings: {
      notifications: false,
      language: 'es',
    },
    lastUpdated: new Date().toISOString(),
  };

  const handleHydrate = () => {
    setHydratedData(serverData);
    setIsHydrated(true);
  };

  const handleReset = () => {
    setHydratedData({});
    setIsHydrated(false);
    stateController.resetAll();
  };

  const handleUpdateAfterHydration = () => {
    if (!counter) return;
    stateController.updateState({
      counter: counter + 1,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">useHydration Demo - Server State Integration</h2>
      <p className="text-gray-600 mb-6">
        This demo shows how useHydration works to merge server-side data into the client state.
        Hydration typically happens once when the component mounts to sync server and client state.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State Display */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Current State (Reactive)</h3>
          <div className="space-y-2">
            <p><strong>User:</strong> {user?.name} ({user?.age} years)</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Counter:</strong> {counter}</p>
            <p><strong>Theme:</strong> {theme}</p>
            <p><strong>Notifications:</strong> {settings?.notifications ? 'On' : 'Off'}</p>
            <p><strong>Language:</strong> {settings?.language}</p>
          </div>
        </div>

        {/* Server Data Preview */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Server Data (To Hydrate)</h3>
          <div className="space-y-2">
            <p><strong>User:</strong> {serverData.user?.name} ({serverData.user?.age} years)</p>
            <p><strong>Email:</strong> {serverData.user?.email}</p>
            <p><strong>Counter:</strong> {serverData.counter}</p>
            <p><strong>Theme:</strong> {serverData.theme}</p>
            <p><strong>Notifications:</strong> {serverData.settings?.notifications ? 'On' : 'Off'}</p>
            <p><strong>Language:</strong> {serverData.settings?.language}</p>
          </div>
        </div>
      </div>

      {/* Hydration Controls */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-purple-800">Hydration Controls</h3>
        <div className="space-x-2 mb-4">
          <button
            onClick={handleHydrate}
            disabled={isHydrated}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isHydrated ? 'Already Hydrated' : 'Hydrate with Server Data'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reset to Initial State
          </button>
        </div>
        
        {isHydrated && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <p className="text-green-800 font-semibold">✅ Hydration Complete!</p>
            <p className="text-green-700 text-sm">
              Server data has been merged into the client state. Notice how the values above have changed.
            </p>
          </div>
        )}
      </div>

      {/* Post-Hydration Actions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Post-Hydration Actions</h3>
        <p className="text-gray-600 mb-3">
          After hydration, you can still update the state normally. The hydrated values become the new baseline.
        </p>
        <button
          onClick={handleUpdateAfterHydration}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Increment Counter (Post-Hydration)
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Points:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>useHydration merges server-side data into client state</li>
          <li>Typically called once when component mounts</li>
          <li>Updates both current state and initial state for reset operations</li>
          <li>Perfect for SSR/SSG scenarios where server data needs to be synced</li>
          <li>Hydrated values become the new baseline for reset operations</li>
        </ul>
      </div>
    </div>
  );
}

// Component that actually uses the hydration hook
export function HydrationComponent() {
  const serverData: Partial<DemoState> = {
    user: {
      name: 'Hydrated User',
      email: 'hydrated@example.com',
      age: 25,
    },
    counter: 100,
    theme: 'dark',
  };

  // This is how you would actually use useHydration in a real component
  stateController.useHydration(serverData);

  const { user, counter, theme } = stateController.useState(['user', 'counter', 'theme']);

  return (
    <div className="p-4 bg-indigo-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-indigo-800">Auto-Hydrated Component</h3>
      <p className="text-sm text-gray-600 mb-2">
        This component automatically hydrates on mount with server data.
      </p>
      <div className="text-sm">
        <p><strong>User:</strong> {user?.name}</p>
        <p><strong>Counter:</strong> {counter}</p>
        <p><strong>Theme:</strong> {theme}</p>
      </div>
    </div>
  );
}
