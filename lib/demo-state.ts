// Demo state interface and initial state for testing all StateController functions

export interface DemoState {
  user: {
    name: string;
    email: string;
    age: number;
  };
  counter: number;
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  settings: {
    notifications: boolean;
    language: string;
  };
  lastUpdated: string;
}

export const initialDemoState: DemoState = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  },
  counter: 0,
  todos: [
    { id: '1', text: 'Learn Zustand', completed: false },
    { id: '2', text: 'Build demo app', completed: false },
  ],
  settings: {
    notifications: true,
    language: 'en',
  },
  lastUpdated: new Date().toISOString(),
};

// Centralized controller and helpers for demos
import { StateController } from './zustand-state-controller';

export const demoController = new StateController<DemoState>(initialDemoState, 'DemoStateController');

export function addTodo(text?: string) {
  const todos = demoController.getValue('todos');
  const newTodo = {
    id: Date.now().toString(),
    text: text ?? `Todo ${todos.length + 1}`,
    completed: false,
  };
  demoController.updateState({ todos: [...todos, newTodo], lastUpdated: new Date().toISOString() });
}

export function toggleTodo(id: string) {
  const todos = demoController.getValue('todos');
  demoController.updateState({
    todos: todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    lastUpdated: new Date().toISOString(),
  });
}
