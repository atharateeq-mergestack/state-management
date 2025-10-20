'use client';

import { useState, useEffect } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function SubscriptionDemo() {
  const [subscriptionLog, setSubscriptionLog] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState<(() => void)[]>([]);

  // Subscribe to state to see changes
  const { counter, user, theme } = stateController.useState(['counter', 'user', 'theme']);

  const addLog = (message: string) => {
    setSubscriptionLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSubscribeToCounter = () => {
    const unsubscribe = stateController.subscribe('counter', (newVal, oldVal) => {
      addLog(`Counter changed: ${oldVal} → ${newVal}`);
    });
    setUnsubscribeFunctions(prev => [...prev, unsubscribe]);
    setIsSubscribed(true);
    addLog('Subscribed to counter changes');
  };

  const handleSubscribeToUser = () => {
    const unsubscribe = stateController.subscribe('user', (newVal, oldVal) => {
      addLog(`User changed: ${oldVal.name} → ${newVal.name}`);
    });
    setUnsubscribeFunctions(prev => [...prev, unsubscribe]);
    setIsSubscribed(true);
    addLog('Subscribed to user changes');
  };

  const handleSubscribeToTheme = () => {
    const unsubscribe = stateController.subscribe('theme', (newVal, oldVal) => {
      addLog(`Theme changed: ${oldVal} → ${newVal}`);
    });
    setUnsubscribeFunctions(prev => [...prev, unsubscribe]);
    setIsSubscribed(true);
    addLog('Subscribed to theme changes');
  };

  const handleUnsubscribeAll = () => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    setUnsubscribeFunctions([]);
    setIsSubscribed(false);
    addLog('Unsubscribed from all subscriptions');
  };

  const handleIncrementCounter = () => {
    if (!counter) return;
    stateController.updateState({
      counter: counter + 1,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateUser = () => {
    if (!user) return;
    stateController.updateState({
      user: {
        ...user,
        name: `User ${Math.floor(Math.random() * 1000)}`,
        age: Math.floor(Math.random() * 50) + 18,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleTheme = () => {
    stateController.updateState({
      theme: theme === 'light' ? 'dark' : 'light',
      lastUpdated: new Date().toISOString(),
    });
  };

  const clearLog = () => {
    setSubscriptionLog([]);
  };

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [unsubscribeFunctions]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Subscription Demo - Manual State Watching</h2>
      <p className="text-gray-600 mb-6">
        This demo shows how to manually subscribe to state changes using the subscribe method.
        Subscriptions allow you to react to state changes outside of React components.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current State Display */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Current State</h3>
          <div className="space-y-2">
            <div>
              <strong>Counter:</strong> {counter}
            </div>
            <div>
              <strong>User:</strong> {user?.name} ({user?.age} years)
            </div>
            <div>
              <strong>Theme:</strong> {theme}
            </div>
          </div>
        </div>

        {/* Subscription Controls */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Subscription Controls</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Subscribe to Changes:</h4>
              <div className="space-y-2">
                <button
                  onClick={handleSubscribeToCounter}
                  disabled={isSubscribed}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Subscribe to Counter
                </button>
                <button
                  onClick={handleSubscribeToUser}
                  disabled={isSubscribed}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Subscribe to User
                </button>
                <button
                  onClick={handleSubscribeToTheme}
                  disabled={isSubscribed}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Subscribe to Theme
                </button>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold text-green-700 mb-2">Unsubscribe:</h4>
              <button
                onClick={handleUnsubscribeAll}
                disabled={!isSubscribed}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Unsubscribe All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* State Update Controls */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Trigger State Changes</h3>
        <p className="text-gray-600 mb-3">
          Click these buttons to trigger state changes. If you're subscribed, you'll see the changes logged below.
        </p>
        <div className="space-x-2">
          <button
            onClick={handleIncrementCounter}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Increment Counter
          </button>
          <button
            onClick={handleUpdateUser}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Update User
          </button>
          <button
            onClick={handleToggleTheme}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Subscription Log */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Subscription Log</h3>
          <button
            onClick={clearLog}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Clear Log
          </button>
        </div>
        <div className="bg-white rounded border p-3 max-h-40 overflow-y-auto">
          {subscriptionLog.length === 0 ? (
            <p className="text-gray-500 italic">No subscription events yet...</p>
          ) : (
            <ul className="space-y-1">
              {subscriptionLog.map((log, index) => (
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
          <li>subscribe(key, listener) - manually watch for state changes</li>
          <li>Returns an unsubscribe function to stop listening</li>
          <li>Listener receives (newValue, oldValue) parameters</li>
          <li>Useful for side effects, logging, analytics, or external integrations</li>
          <li>Remember to unsubscribe to prevent memory leaks</li>
          <li>Subscriptions work outside of React's render cycle</li>
        </ul>
      </div>
    </div>
  );
}
