import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// In-memory localStorage mock for Node 26 + jsdom
const storageMap = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return storageMap.size;
  },
  clear() {
    storageMap.clear();
  },
  getItem(key: string) {
    return storageMap.has(key) ? storageMap.get(key)! : null;
  },
  key(index: number) {
    return Array.from(storageMap.keys())[index] ?? null;
  },
  removeItem(key: string) {
    storageMap.delete(key);
  },
  setItem(key: string, value: string) {
    storageMap.set(key, String(value));
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.scrollTo for jsdom
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

// Mock matchMedia for reduced-motion queries in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  cleanup();
  storageMap.clear();
});
