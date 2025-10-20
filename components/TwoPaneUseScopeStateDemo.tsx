'use client';

import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

const stateController = new StateController<DemoState>(initialDemoState, 'TwoPaneUseScopeStateController');

function Editor() {
    const [user, setUser] = stateController.useScopeState('user');
    const [counter, setCounter] = stateController.useScopeState('counter');
    const [theme, setTheme] = stateController.useScopeState('theme');
    const [todos, setTodos] = stateController.useScopeState('todos');

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg border h-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Editor (useScopeState)</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">User</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="rounded border px-3 py-2" placeholder="Name" />
                        <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="rounded border px-3 py-2" placeholder="Email" />
                        <input type="number" value={user.age} onChange={(e) => setUser({ ...user, age: Number(e.target.value) || user.age })} className="rounded border px-3 py-2" placeholder="Age" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Counter</div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-800">{counter}</div>
                        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setCounter(counter - 1)}>-1</button>
                        <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={() => setCounter(counter + 1)}>+1</button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Theme</div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle Theme (current: {theme})</button>
                </div>

                <div className="space-y-2">
                    <div className="font-semibold text-gray-700">Todos</div>
                    <div className="space-y-2">
                        {todos.map(t => (
                            <div key={t.id} className="flex items-center gap-2">
                                <input type="checkbox" checked={t.completed} onChange={() => setTodos(todos.map(td => td.id === t.id ? { ...td, completed: !td.completed } : td))} />
                                <span className={t.completed ? 'line-through text-gray-500' : ''}>{t.text}</span>
                            </div>
                        ))}
                        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setTodos([...todos, { id: Date.now().toString(), text: `Todo ${todos.length + 1}`, completed: false }])}>Add Todo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Viewer() {
    const { user, counter, theme, todos, lastUpdated } = stateController.useState(['user', 'counter', 'theme', 'todos', 'lastUpdated']);
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg border h-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Viewer (reactive)</h2>
            <div className="space-y-4 text-gray-800">
                <div>
                    <div className="font-semibold">User</div>
                    <div>Name: {user?.name}</div>
                    <div>Email: {user?.email}</div>
                    <div>Age: {user?.age}</div>
                </div>
                <div>
                    <div className="font-semibold">Counter</div>
                    <div>{counter}</div>
                </div>
                <div>
                    <div className="font-semibold">Theme</div>
                    <div>{theme}</div>
                </div>
                <div>
                    <div className="font-semibold">Todos</div>
                    <ul className="list-disc list-inside">
                        {todos?.map(t => (<li key={t.id} className={t.completed ? 'line-through text-gray-500' : ''}>{t.text}</li>))}
                    </ul>
                </div>
                <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
            </div>
        </div>
    );
}

export function TwoPaneUseScopeStateDemo() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Editor />
            <Viewer />
        </div>
    );
}


