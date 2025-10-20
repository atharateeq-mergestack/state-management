'use client';

import { useState } from 'react';
import { TwoPaneUseStateDemo } from '../components/TwoPaneUseStateDemo';
import { TwoPaneUseScopeStateDemo } from '../components/TwoPaneUseScopeStateDemo';
import { TwoPaneGetValueDemo } from '../components/TwoPaneGetValueDemo';
import { TwoPaneGetValuesDemo } from '../components/TwoPaneGetValuesDemo';

export default function StateManagementDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  const demos = [
    { key: 'useState', title: 'useState(keys[])', description: 'Reactive two-pane demo' },
    { key: 'useScopeState', title: 'useScopeState(key)', description: 'Reactive two-pane demo' },
    { key: 'getValue', title: 'getValue', description: 'Non-reactive two-pane demo (refresh needed)' },
    { key: 'getValues', title: 'getValues', description: 'Non-reactive two-pane demo (refresh needed)' },
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
              <TwoPaneUseStateDemo />
            </section>
          )}

          {selected === 'useScopeState' && (
            <section>
              <TwoPaneUseScopeStateDemo />
            </section>
          )}

          {selected === 'getValue' && (
            <section>
              <TwoPaneGetValueDemo />
            </section>
          )}

          {selected === 'getValues' && (
            <section>
              <TwoPaneGetValuesDemo />
            </section>
          )}
        </div>

      </div>
    </div>
  );
}