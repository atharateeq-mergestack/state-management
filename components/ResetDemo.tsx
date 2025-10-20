'use client';

import { useState } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function ResetDemo() {
  const [resetLog, setResetLog] = useState<string[]>([]);

  // Subscribe to state to see reset effects
  const { user, counter, theme, todos, settings } = stateController.useState(['user', 'counter', 'theme', 'todos', 'settings']);

  const addLog = (message: string) => {
    setResetLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleModifyState = () => {
    stateController.updateState({
      user: {
        name: 'Modified User',
        email: 'modified@example.com',
        age: 99,
      },
      counter: 999,
      theme: 'dark',
      todos: [
        { id: '1', text: 'Modified Todo 1', completed: true },
        { id: '2', text: 'Modified Todo 2', completed: false },
        { id: '3', text: 'Modified Todo 3', completed: true },
      ],
      settings: {
        notifications: false,
        language: 'fr',
      },
      lastUpdated: new Date().toISOString(),
    });
    addLog('State modified with new values');
  };

  const handleResetAll = () => {
    stateController.resetAll();
    addLog('resetAll() called - entire state reset to initial values');
  };

  const handleResetUser = () => {
    stateController.resetState('user');
    addLog('resetState("user") called - only user reset to initial value');
  };

  const handleResetCounter = () => {
    stateController.resetState('counter');
    addLog('resetState("counter") called - only counter reset to initial value');
  };

  const handleResetTheme = () => {
    stateController.resetState('theme');
    addLog('resetState("theme") called - only theme reset to initial value');
  };

  const handleResetMultiple = () => {
    stateController.resetStates(['user', 'counter', 'theme']);
    addLog('resetStates(["user", "counter", "theme"]) called - multiple keys reset');
  };

  const handleResetTodos = () => {
    stateController.resetState('todos');
    addLog('resetState("todos") called - todos reset to initial value');
  };

  const handleResetSettings = () => {
    stateController.resetState('settings');
    addLog('resetState("settings") called - settings reset to initial value');
  };

  const clearLog = () => {
    setResetLog([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reset Functions Demo</h2>
      <p className="text-gray-600 mb-6">
        This demo shows all the reset functions available in the StateController.
        You can reset individual keys, multiple keys, or the entire state back to initial values.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current State Display */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Current State</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>User:</strong> {user?.name} ({user?.age} years) - {user?.email}
            </div>
            <div>
              <strong>Counter:</strong> {counter}
            </div>
            <div>
              <strong>Theme:</strong> {theme}
            </div>
            <div>
              <strong>Todos:</strong> {todos?.length} items
              <ul className="ml-4 mt-1">
                {todos?.map(todo => (
                  <li key={todo.id} className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Settings:</strong> Notifications: {settings?.notifications ? 'On' : 'Off'}, Language: {settings?.language}
            </div>
          </div>
        </div>

        {/* Reset Controls */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Reset Controls</h3>
          <div className="space-y-3">
            <div>
              <button
                onClick={handleModifyState}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors mb-2"
              >
                Modify State (Set New Values)
              </button>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="font-semibold text-green-700 mb-2">Individual Resets:</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetUser}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Reset User
                </button>
                <button
                  onClick={handleResetCounter}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Reset Counter
                </button>
                <button
                  onClick={handleResetTheme}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Reset Theme
                </button>
                <button
                  onClick={handleResetTodos}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Reset Todos
                </button>
                <button
                  onClick={handleResetSettings}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Reset Settings
                </button>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold text-green-700 mb-2">Multiple Resets:</h4>
              <button
                onClick={handleResetMultiple}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Reset User, Counter, Theme
              </button>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold text-green-700 mb-2">Full Reset:</h4>
              <button
                onClick={handleResetAll}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reset All State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Log */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Reset Log</h3>
          <button
            onClick={clearLog}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Clear Log
          </button>
        </div>
        <div className="bg-white rounded border p-3 max-h-40 overflow-y-auto">
          {resetLog.length === 0 ? (
            <p className="text-gray-500 italic">No reset operations yet...</p>
          ) : (
            <ul className="space-y-1">
              {resetLog.map((log, index) => (
                <li key={index} className="text-sm text-gray-700 font-mono">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Points:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>resetState(key) - resets a single key to its initial value</li>
          <li>resetStates(keys[]) - resets multiple keys to their initial values</li>
          <li>resetAll() - resets the entire state to initial values</li>
          <li>Reset operations preserve other state values (except resetAll)</li>
          <li>Initial values are set when the StateController is created</li>
          <li>Useful for form resets, user logout, or returning to default state</li>
        </ul>
      </div>
    </div>
  );
}
