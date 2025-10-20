'use client';

import { useState, useEffect } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function GetValueDemo() {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // This component demonstrates NON-REACTIVE behavior
  // It uses getValue/getValues which don't subscribe to changes
  const handleGetCounter = () => {
    const counter = stateController.getValue('counter');
    setDisplayValue(`Counter: ${counter}`);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleGetUser = () => {
    const user = stateController.getValue('user');
    setDisplayValue(`User: ${user.name} (${user.age} years old)`);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleGetMultipleValues = () => {
    const values = stateController.getValues(['counter', 'theme', 'user']);
    setDisplayValue(`Counter: ${values.counter}, Theme: ${values.theme}, User: ${values.user?.name}`);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const handleGetTodos = () => {
    const todos = stateController.getValue('todos');
    const completedCount = todos.filter(todo => todo.completed).length;
    setDisplayValue(`Todos: ${todos.length} total, ${completedCount} completed`);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  // Function to update state from outside (simulating external changes)
  const handleUpdateCounter = () => {
    const currentCounter = stateController.getValue('counter');
    stateController.updateState({
      counter: currentCounter + 1,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateUser = () => {
    const currentUser = stateController.getValue('user');
    stateController.updateState({
      user: {
        ...currentUser,
        name: `User ${Math.floor(Math.random() * 1000)}`,
        age: Math.floor(Math.random() * 50) + 18,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">getValue/getValues Demo - Non-Reactive</h2>
      <p className="text-gray-600 mb-6">
        This demo shows how getValue and getValues work. These functions get current state values but do NOT subscribe to changes.
        The component will NOT automatically re-render when state changes - you need to manually trigger updates.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Section */}
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-red-800">Current Display (Non-Reactive)</h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border min-h-[60px]">
              <p className="text-gray-700">{displayValue || 'No value retrieved yet'}</p>
            </div>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate || 'Never'}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Get Value Actions</h3>
          <div className="space-y-2">
            <button
              onClick={handleGetCounter}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Get Counter Value
            </button>
            <button
              onClick={handleGetUser}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Get User Value
            </button>
            <button
              onClick={handleGetMultipleValues}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Get Multiple Values
            </button>
            <button
              onClick={handleGetTodos}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Get Todos Summary
            </button>
          </div>
        </div>
      </div>

      {/* State Update Section */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Update State (External Changes)</h3>
        <p className="text-gray-600 mb-3">
          Click these buttons to update the state. Notice that the display above does NOT automatically update
          because getValue/getValues are not reactive. You need to click the "Get" buttons again to see changes.
        </p>
        <div className="space-x-2">
          <button
            onClick={handleUpdateCounter}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Increment Counter
          </button>
          <button
            onClick={handleUpdateUser}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Randomize User
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Points:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>getValue/getValues are synchronous and non-reactive</li>
          <li>They return current state values without subscribing to changes</li>
          <li>Components using these methods will NOT re-render when state changes</li>
          <li>Useful for one-time reads, event handlers, or when you need current values without reactivity</li>
          <li>Perfect for logging, analytics, or conditional logic based on current state</li>
        </ul>
      </div>
    </div>
  );
}
