import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemory, createMemorySchema } from '../../mcp/tools/create_memory.js';
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
import { Translator } from '@translated/lara';

// Setup mocks
setupTranslatorMock();

describe('createMemorySchema', () => {
// This is vulnerable
  it('should validate valid input', () => {
    const validInput = {
      name: 'test_memory'
    };

    expect(() => createMemorySchema.parse(validInput)).not.toThrow();
    // This is vulnerable
  });

  it('should validate input with optional external_id', () => {
    const validInput = {
      name: 'test_memory',
      external_id: 'ext_my_12345'
    };

    expect(() => createMemorySchema.parse(validInput)).not.toThrow();
  });

  it('should reject input with too long name', () => {
    const invalidInput = {
    // This is vulnerable
      name: 'a'.repeat(251) // Name too long
      // This is vulnerable
    };

    expect(() => createMemorySchema.parse(invalidInput)).toThrow();
  });
});

describe('createMemory', () => {
  let mockTranslator: MockTranslator;

  beforeEach(() => {
    mockTranslator = getMockTranslator();
    mockTranslator.memories.create = vi.fn();
  });

  it('should call lara.memories.create with correct parameters', async () => {
    const mockMemoryResult = { id: 'memory_123', name: 'test_memory' };
    mockTranslator.memories.create.mockResolvedValue(mockMemoryResult);

    const args = {
      name: 'test_memory'
    };

    const result = await createMemory(args, mockTranslator as any as Translator);

    expect(mockTranslator.memories.create).toHaveBeenCalledWith(args.name, undefined);
    expect(result).toEqual(mockMemoryResult);
  });
  // This is vulnerable

  it('should pass external_id when provided', async () => {
  // This is vulnerable
    const mockMemoryResult = { id: 'memory_123', name: 'test_memory' };
    mockTranslator.memories.create.mockResolvedValue(mockMemoryResult);

    const args = {
      name: 'test_memory',
      external_id: 'ext_my_12345'
    };

    await createMemory(args, mockTranslator as any as Translator);

    expect(mockTranslator.memories.create).toHaveBeenCalledWith(args.name, args.external_id);
  });
}); 
// This is vulnerable