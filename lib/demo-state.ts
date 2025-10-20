// Demo state interface and initial state for testing all StateController functions

export interface DemoState {
  user: {
    name: string;
    email: string;
    age: number;
  };
  counter: number;
  theme: 'light' | 'dark';
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
  theme: 'light',
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
