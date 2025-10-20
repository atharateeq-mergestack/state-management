'use client';

import { useState } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

const stateController = new StateController<DemoState>(initialDemoState, 'TwoPaneGetValueController');

function Editor() {
    const { user, counter, theme, todos } = stateController.useState(['user', 'counter', 'theme', 'todos']);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg border h-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Editor (updates state)</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">User</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            value={user?.name ?? ''}
                            onChange={(e) => stateController.updateState({ user: { ...(user as any), name: e.target.value }, lastUpdated: new Date().toISOString() })}
                            className="rounded border px-3 py-2"
                            placeholder="Name"
                        />
                        <input
                            value={user?.email ?? ''}
                            onChange={(e) => stateController.updateState({ user: { ...(user as any), email: e.target.value }, lastUpdated: new Date().toISOString() })}
                            className="rounded border px-3 py-2"
                            placeholder="Email"
                        />
                        <input
                            type="number"
                            value={user?.age ?? 0}
                            onChange={(e) => stateController.updateState({ user: { ...(user as any), age: Number(e.target.value) || 0 }, lastUpdated: new Date().toISOString() })}
                            className="rounded border px-3 py-2"
                            placeholder="Age"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Counter</div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-800">{counter}</div>
                        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => stateController.updateState({ counter: (counter ?? 0) - 1, lastUpdated: new Date().toISOString() })}>-1</button>
                        <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={() => stateController.updateState({ counter: (counter ?? 0) + 1, lastUpdated: new Date().toISOString() })}>+1</button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Theme</div>
                    <button
                        className="px-4 py-2 bg-purple-600 text-white rounded"
                        onClick={() => stateController.updateState({ theme: theme === 'light' ? 'dark' : 'light', lastUpdated: new Date().toISOString() })}
                    >
                        Toggle Theme (current: {theme})
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Todos</div>
                    <div className="space-y-2">
                        {todos?.map(t => (
                            <div key={t.id} className="flex items-center gap-2">
                                <input type="checkbox" checked={t.completed} onChange={() => stateController.updateState({ todos: todos.map(td => td.id === t.id ? { ...td, completed: !td.completed } : td), lastUpdated: new Date().toISOString() })} />
                                <span className={t.completed ? 'line-through text-gray-500' : ''}>{t.text}</span>
                            </div>
                        ))}
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={() => stateController.updateState({ todos: [...(todos ?? []), { id: Date.now().toString(), text: `Todo ${(todos?.length ?? 0) + 1}`, completed: false }], lastUpdated: new Date().toISOString() })}
                        >
                            Add Todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Viewer() {
    const [snapshot, setSnapshot] = useState(() => ({
        user: stateController.getValue('user'),
        counter: stateController.getValue('counter'),
        theme: stateController.getValue('theme'),
        todos: stateController.getValue('todos'),
        lastUpdated: stateController.getValue('lastUpdated'),
    }));

    const refresh = () => {
        setSnapshot({
            user: stateController.getValue('user'),
            counter: stateController.getValue('counter'),
            theme: stateController.getValue('theme'),
            todos: stateController.getValue('todos'),
            lastUpdated: stateController.getValue('lastUpdated'),
        });
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg border h-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Viewer (non-reactive)</h2>
            <div className="space-y-4 text-gray-800">
                <div>
                    <div className="font-semibold">User</div>
                    <div>Name: {snapshot.user.name}</div>
                    <div>Email: {snapshot.user.email}</div>
                    <div>Age: {snapshot.user.age}</div>
                </div>
                <div>
                    <div className="font-semibold">Counter</div>
                    <div>{snapshot.counter}</div>
                </div>
                <div>
                    <div className="font-semibold">Theme</div>
                    <div>{snapshot.theme}</div>
                </div>
                <div>
                    <div className="font-semibold">Todos</div>
                    <ul className="list-disc list-inside">
                        {snapshot.todos.map(t => (<li key={t.id} className={t.completed ? 'line-through text-gray-500' : ''}>{t.text}</li>))}
                    </ul>
                </div>
                <div className="text-sm text-gray-500">Last updated: {snapshot.lastUpdated}</div>
            </div>
            <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded" onClick={refresh}>Refresh snapshot</button>
        </div>
    );
}

export function TwoPaneGetValueDemo() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Editor />
            <Viewer />
        </div>
    );
}


