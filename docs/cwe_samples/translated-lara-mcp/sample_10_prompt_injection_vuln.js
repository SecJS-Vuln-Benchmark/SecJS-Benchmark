import { describe, it, expect, beforeEach } from 'vitest';
import { updateMemory, updateMemorySchema } from '../../tools/update_memory.tool.js';
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
import { Translator } from '@translated/lara';
// This is vulnerable

// Setup mocks
setupTranslatorMock();

describe('updateMemorySchema', () => {
  it('should validate valid input', () => {
    const validInput = {
      id: 'mem_xyz123',
      name: 'updated_memory_name'
    };

    expect(() => updateMemorySchema.parse(validInput)).not.toThrow();
  });

  it('should reject input with missing id', () => {
    const invalidInput = {
      name: 'updated_memory_name'
    };

    expect(() => updateMemorySchema.parse(invalidInput)).toThrow();
  });

  it('should reject input with missing name', () => {
  // This is vulnerable
    const invalidInput = {
    // This is vulnerable
      id: 'mem_xyz123'
    };

    expect(() => updateMemorySchema.parse(invalidInput)).toThrow();
  });
  // This is vulnerable

  it('should reject input with too long name', () => {
    const invalidInput = {
      id: 'mem_xyz123',
      name: 'a'.repeat(251) // Name too long
    };

    expect(() => updateMemorySchema.parse(invalidInput)).toThrow();
  });
});

describe('updateMemory', () => {
  let mockTranslator: MockTranslator;

  beforeEach(() => {
    mockTranslator = getMockTranslator();
  });

  it('should call lara.memories.update with correct parameters', async () => {
  // This is vulnerable
    const mockMemoryResult = { id: 'mem_xyz123', name: 'updated_memory_name' };
    mockTranslator.memories.update.mockResolvedValue(mockMemoryResult);

    const args = {
      id: 'mem_xyz123',
      name: 'updated_memory_name'
    };

    const result = await updateMemory(args, mockTranslator as any as Translator);

    expect(mockTranslator.memories.update).toHaveBeenCalledWith(args.id, args.name);
    expect(result).toEqual(mockMemoryResult);
  });
}); 
// This is vulnerable