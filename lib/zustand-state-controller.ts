/* eslint-disable @typescript-eslint/no-explicit-any */
/* A generic Zustand StateController similar in API to your Jotai controller */

import { create, StateCreator } from 'zustand';
import type { StoreApi } from 'zustand';
import { useEffect, useCallback } from 'react';

type PartialKeys<T> = (keyof T)[];

/**
 * Core store shape: we keep state only (no actions). The controller will call setState/getState on the store.
 */
export class StateController<T extends Record<string, any>> {
  // The React hook returned by zustand create (also contains api: getState/setState/subscribe)
  useStore: any;
  storeApi: StoreApi<T>;
  initialState: T;

  constructor(initialState: T, name?: string) {
    this.initialState = initialState;

    // Create the zustand store. We expose both the hook (useStore) and the store API.
    // We keep only state in the store; controller manipulates state via setState/getState.
    const creator: StateCreator<T> = (set, get) => ({
      ...structuredClone(initialState) as T,
    });

    // create returns a hook that also has .getState .setState .subscribe attached
    this.useStore = create<T>(creator);
    this.storeApi = this.useStore as StoreApi<T>;

    // optionally expose a debug name on the hook (not required)
    if (name) {
      try {
        Object.defineProperty(this.useStore, 'name', { value: name });
      } catch { }
    }
  }

  /**
   * Hook: generic multi-key subscription by composing per-key subscriptions.
   * Note: This calls the store hook once per key. Ensure keys order/length is stable across renders.
   */
  useGenericHooks(keys: (keyof T)[]): Partial<T> {
    const values: Partial<T> = {};
    for (const key of keys) {
      const value = this.useStore((s: T) => s[key]) as T[typeof key];
      (values as any)[key] = value;
    }
    return values;
  }

  /**
   * Hook: subscribe to multiple keys. Delegates to useGenericHooks for Jotai-like API.
   */
  useState(keys: (keyof T)[]): Partial<T> {
    return this.useGenericHooks(keys);
  }
  /**
   * Hook: subscribe to a single key and get a setter for that key.
   * Returns [value, setValue].
   *
   * Usage: const [user, setUser] = controller.useScopeState('user');
   */
  useScopeState<K extends keyof T>(key: K): [T[K], (val: T[K] | ((prev: T[K]) => T[K])) => void] {
    // value subscription
    const value = this.useStore((s: T) => s[key]) as T[K];

    // stable setter
    const setter = useCallback((valOrUpdater: T[K] | ((prev: T[K]) => T[K])) => {
      // If an updater is passed, compute new value from current store
      if (typeof valOrUpdater === 'function') {
        // type cast because TS can't infer function type here
        this.storeApi.setState((prev: T) => {
          const newVal = (valOrUpdater as (prev: T[K]) => T[K])(prev[key]);
          return { ...(prev as any), [key]: newVal } as T;
        });
      } else {
        this.storeApi.setState({ ...(this.storeApi.getState() as any), [key]: valOrUpdater } as T);
      }
    }, [key]);

    return [value, setter];
  }

  /**
   * Hydrate/merge initial values into store. Use as a hook so it runs in React lifecycle when needed.
   * Example: controller.useHydration(serverState)
   */
  useHydration(state: Partial<T>) {
    useEffect(() => {
      if (!state || Object.keys(state).length === 0) return;
      // ensure any fields missing in initialState are added/created
      this.storeApi.setState((prev) => ({ ...(prev as any), ...(state as any) }) as T);
      // Also update initialState so resetAll respects hydrated defaults
      this.initialState = { ...(this.initialState as any), ...(state as any) } as T;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount
  }

  /**
   * Replace the store state with newState merged with initialState:
   * (similar to your Jotai setState that merged initialState with new partial state)
   */
  setState(newState: Partial<T>) {
    const merged = { ...(structuredClone(this.initialState) as any), ...(newState as any) } as T;
    this.storeApi.setState(merged);
  }

  /**
   * Merge new state into previous state (preserves other keys).
   */
  updateState(newState: Partial<T>) {
    this.storeApi.setState((prev) => ({ ...(prev as any), ...(newState as any) }) as T);
  }

  /**
   * Get a synchronous snapshot of specific keys (no subscription).
   */
  getValues(keys: PartialKeys<T>): Partial<T> {
    const s = this.storeApi.getState();
    const out: Partial<T> = {};
    for (const k of keys) out[k] = s[k];
    return out;
  }

  /**
   * Get a synchronous value for a single key (no subscription).
   */
  getValue<K extends keyof T>(key: K): T[K] {
    const s = this.storeApi.getState();
    if (!(key in s)) {
      throw new Error(`Key "${String(key)}" does not exist in state`);
    }
    return s[key];
  }

  /**
   * Reset whole state back to initialState (replace).
   */
  resetAll() {
    this.storeApi.setState(structuredClone(this.initialState) as T);
  }

  /**
   * Reset specific keys back to their initial values.
   */
  resetStates(keys: PartialKeys<T>) {
    const prev = this.storeApi.getState();
    const patch: Partial<T> = {};
    for (const k of keys) {
      patch[k] = this.initialState[k];
    }
    this.storeApi.setState({ ...(prev as any), ...(patch as any) } as T);
  }

  /**
   * Reset a single key back to its initial value.
   */
  resetState(key: keyof T) {
    const prev = this.storeApi.getState();
    this.storeApi.setState({ ...(prev as any), [key]: this.initialState[key] } as T);
  }

  /**
   * Subscribe to a key changes (returns unsubscribe function)
   * listener receives newValue and oldValue
   */
  subscribe<K extends keyof T>(key: K, listener: (newVal: T[K], oldVal: T[K]) => void) {
    // use storeApi.subscribe with listener that receives the full state
    const unsubscribe = this.storeApi.subscribe((state, prevState) => {
      const newVal = state[key];
      const oldVal = prevState[key];
      listener(newVal, oldVal);
    });
    return unsubscribe;
  }

  /**
   * Low-level accessors to the underlying store api if needed
   */
  getStoreApi() {
    return this.storeApi;
  }

  getUseStoreHook() {
    return this.useStore;
  }
}
