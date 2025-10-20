'use client';

import { useState } from 'react';
import { UseStateDemo } from '../components/UseStateDemo';
import { UseScopeStateDemo } from '../components/UseScopeStateDemo';
import { GetValueDemo } from '../components/GetValueDemo';
import { UseHydrationDemo, HydrationComponent } from '../components/UseHydrationDemo';
import { ResetDemo } from '../components/ResetDemo';
import { SubscriptionDemo } from '../components/SubscriptionDemo';

export default function StateManagementDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  const demos = [
    { key: 'useState', title: 'useState(keys[])', description: 'Subscribe to multiple keys' },
    { key: 'useScopeState', title: 'useScopeState(key)', description: 'Single key with setter' },
    { key: 'getValue', title: 'getValue / getValues', description: 'Non-reactive accessors' },
    { key: 'useHydration', title: 'useHydration(data)', description: 'Merge server state' },
    { key: 'reset', title: 'Reset functions', description: 'Reset one or many keys' },
    { key: 'subscription', title: 'subscribe(key, listener)', description: 'Manual watching' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zustand State Controller Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pick a card to view a focused demo. Each card renders its component below.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelected(d.key)}
              className={`text-left p-6 bg-white rounded-lg shadow border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected === d.key ? 'ring-2 ring-blue-500' : ''
                }`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{d.title}</h3>
              <p className="text-gray-600">{d.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Demo Renderer */}
        <div className="mt-12 space-y-12">
          {selected === 'useState' && (
            <section>
              <UseStateDemo />
            </section>
          )}

          {selected === 'useScopeState' && (
            <section>
              <UseScopeStateDemo />
            </section>
          )}

          {selected === 'getValue' && (
            <section>
              <GetValueDemo />
            </section>
          )}

          {selected === 'useHydration' && (
            <>
              <section>
                <UseHydrationDemo />
              </section>
              <section>
                <div className="p-6 bg-white rounded-lg shadow-lg border">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Auto-Hydration Component</h2>
                  <p className="text-gray-600 mb-6">
                    This component automatically hydrates with server data when it mounts.
                  </p>
                  <HydrationComponent />
                </div>
              </section>
            </>
          )}

          {selected === 'reset' && (
            <section>
              <ResetDemo />
            </section>
          )}

          {selected === 'subscription' && (
            <section>
              <SubscriptionDemo />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              StateController Features Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Reactive Hooks</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• useState(keys[]) - Subscribe to multiple keys</li>
                  <li>• useScopeState(key) - Single key with setter</li>
                  <li>• useHydration(data) - Merge server state</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Non-Reactive Access</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• getValue(key) - Get single value</li>
                  <li>• getValues(keys[]) - Get multiple values</li>
                  <li>• setState(data) - Replace state</li>
                  <li>• updateState(data) - Merge state</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Reset & Subscribe</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• resetState(key) - Reset single key</li>
                  <li>• resetStates(keys[]) - Reset multiple keys</li>
                  <li>• resetAll() - Reset entire state</li>
                  <li>• subscribe(key, listener) - Manual watching</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <strong>Built with:</strong> Zustand, React, TypeScript, Next.js, Tailwind CSS
              </p>
              <p className="text-blue-700 text-sm mt-2">
                This library provides a consistent API for state management that can be easily extended
                to support other state management solutions like Redux, Jotai, or Valtio.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}