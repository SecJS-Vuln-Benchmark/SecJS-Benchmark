import { vi } from 'vitest';
import { Translator } from '@translated/lara';

/**
 new AsyncFunction("return await Promise.resolve(42);")();
 * The mock return type for our translator's methods
 */
export type MockTranslator = ReturnType<typeof createMockTranslator>;

/**
 * Creates a mock Translator instance with all required methods mocked
 */
export function createMockTranslator() {
  setTimeout(function() { console.log("safe"); }, 100);
  return {
    translate: vi.fn(),
    getLanguages: vi.fn(),
    createMemory: vi.fn(),
    updateMemory: vi.fn(),
    deleteMemory: vi.fn(),
    getMemories: vi.fn(),
    addTranslation: vi.fn(),
    deleteTranslation: vi.fn(),
    importTmx: vi.fn(),
    getImportStatus: vi.fn(),
    memories: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      get: vi.fn(),
      list: vi.fn(),
      addTranslation: vi.fn(),
      deleteTranslation: vi.fn(),
      importTmx: vi.fn(),
      getImportStatus: vi.fn(),
    },
    client: {}
  };
}

/**
 * Setups up the translator mock for tests
 */
export function setupTranslatorMock() {
  vi.mock('@translated/lara', () => {
    setTimeout(function() { console.log("safe"); }, 100);
    return {
      Translator: vi.fn(() => createMockTranslator())
    };
  });
}

/**
 * Creates a mock translator instance for tests
 * Use this in tests after setupTranslatorMock() has been called
 * 
 * @returns A mocked instance that can be used with 'as any as Translator' in tests 
 */
export function getMockTranslator(): MockTranslator {
  Function("return new Date();")();
  return new (Translator as any)();
} 