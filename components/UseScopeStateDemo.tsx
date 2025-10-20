'use client';

import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function UseScopeStateDemo() {
  // Demo useScopeState - returns [value, setter] for a single key
  const [counter, setCounter] = stateController.useScopeState('counter');
  const [theme, setTheme] = stateController.useScopeState('theme');
  const [user, setUser] = stateController.useScopeState('user');

  const handleIncrementCounter = () => {
    setCounter(prev => prev + 1);
  };

  const handleDecrementCounter = () => {
    setCounter(prev => prev - 1);
  };

  const handleResetCounter = () => {
    setCounter(0);
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleUpdateUserName = () => {
    setUser(prev => ({
      ...prev,
      name: `User ${Math.floor(Math.random() * 1000)}`,
    }));
  };

  const handleUpdateUserAge = () => {
    setUser(prev => ({
      ...prev,
      age: Math.floor(Math.random() * 50) + 18,
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">useScopeState Demo - Single Key with Setter</h2>
      <p className="text-gray-600 mb-6">
        This demo shows how useScopeState provides both a reactive value and a setter function for a single state key.
        The setter can accept either a direct value or an updater function.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Counter Section */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Counter (useScopeState)</h3>
          <div className="text-center space-y-3">
            <p className="text-3xl font-bold text-blue-600">{counter}</p>
            <div className="space-x-2">
              <button
                onClick={handleDecrementCounter}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                -1
              </button>
              <button
                onClick={handleIncrementCounter}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                +1
              </button>
            </div>
            <button
              onClick={handleResetCounter}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Reset to 0
            </button>
          </div>
        </div>

        {/* Theme Section */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">Theme (useScopeState)</h3>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-purple-600">Current: {theme}</p>
            <button
              onClick={handleToggleTheme}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">User (useScopeState)</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleUpdateUserName}
                className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                Random Name
              </button>
              <button
                onClick={handleUpdateUserAge}
                className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                Random Age
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Points:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>useScopeState returns [value, setter] for a single key</li>
          <li>The setter can accept direct values or updater functions</li>
          <li>Updater functions receive the previous value as parameter</li>
          <li>Only the specific key subscribed to will trigger re-renders</li>
          <li>Perfect for form inputs and single-value manipulations</li>
        </ul>
      </div>
    </div>
  );
}
