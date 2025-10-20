'use client';

import { useState } from 'react';
import { StateController } from '../lib/zustand-state-controller';
import { DemoState, initialDemoState } from '../lib/demo-state';

// Create a global state controller instance
const stateController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function UseStateDemo() {
  // Demo 1: Subscribe to multiple keys - these components will re-render when any of these values change
  const { user, counter, theme } = stateController.useState(['user', 'counter', 'theme']);

  // Demo 2: Subscribe to single key
  const { todos } = stateController.useState(['todos']);

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

  const handleIncrementCounter = () => {
    if (!counter) return;
    stateController.updateState({
      counter: counter + 1,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleTheme = () => {
    stateController.updateState({
      theme: theme === 'light' ? 'dark' : 'light',
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddTodo = () => {
    if (!todos) return;
    const newTodo = {
      id: Date.now().toString(),
      text: `Todo ${todos.length + 1}`,
      completed: false,
    };
    stateController.updateState({
      todos: [...todos, newTodo],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleTodo = (id: string) => {
    if (!todos) return;
    stateController.updateState({
      todos: todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">useState Demo - Reactive Updates</h2>
      <p className="text-gray-600 mb-6">
        This demo shows how useState subscribes to state changes and automatically re-renders components when values change.
        All components below will update automatically when their subscribed values change.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info Section */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">User Info (useState)</h3>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Age:</strong> {user?.age}</p>
          </div>
          <button
            onClick={handleUpdateUser}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Update User (Random)
          </button>
        </div>

        {/* Counter Section */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Counter (useState)</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-3">{counter}</p>
            <button
              onClick={handleIncrementCounter}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Increment
            </button>
          </div>
        </div>

        {/* Theme Section */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">Theme (useState)</h3>
          <div className="space-y-2">
            <p><strong>Current Theme:</strong> {theme}</p>
            <button
              onClick={handleToggleTheme}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Todos Section */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-orange-800">Todos (useState)</h3>
          <div className="space-y-2 mb-3">
            {todos?.map(todo => (
              <div key={todo.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  className="rounded"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Add Todo
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 text-gray-800">Key Points:</h4>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>All components above automatically re-render when their subscribed state changes</li>
          <li>useState uses shallow comparison to prevent unnecessary re-renders</li>
          <li>Multiple keys can be subscribed to in a single useState call</li>
          <li>Components only re-render when their specific subscribed values change</li>
        </ul>
      </div>
    </div>
  );
}
