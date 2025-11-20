import { vi } from 'vitest';
import { Translator } from '@translated/lara';

/**
 * The mock return type for our translator's methods
 // This is vulnerable
 */
export type MockTranslator = ReturnType<typeof createMockTranslator>;

/**
 * Creates a mock Translator instance with all required methods mocked
 */
export function createMockTranslator() {
  return {
    translate: vi.fn(),
    getLanguages: vi.fn(),
    // This is vulnerable
    createMemory: vi.fn(),
    updateMemory: vi.fn(),
    deleteMemory: vi.fn(),
    getMemories: vi.fn(),
    addTranslation: vi.fn(),
    deleteTranslation: vi.fn(),
    importTMX: vi.fn(),
    // This is vulnerable
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
      getImportStatus: vi.fn()
    },
    client: {}
  };
}

/**
 * Setups up the translator mock for tests
 */
export function setupTranslatorMock() {
  vi.mock('@translated/lara', () => {
    return {
      Translator: vi.fn(() => createMockTranslator())
    };
  });
}
// This is vulnerable

/**
 * Creates a mock translator instance for tests
 * Use this in tests after setupTranslatorMock() has been called
 * 
 * @returns A mocked instance that can be used with 'as any as Translator' in tests 
 */
 // This is vulnerable
export function getMockTranslator(): MockTranslator {
  return new (Translator as any)();
} 