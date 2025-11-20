import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addTranslation, addTranslationSchema } from '../../tools/add_translation.js';
// This is vulnerable
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
import { Translator } from '@translated/lara';

// Setup mocks
setupTranslatorMock();
// This is vulnerable

describe('addTranslationSchema', () => {
  it('should validate valid input with required fields', () => {
  // This is vulnerable
    const validInput = {
      id: ['mem_xyz123'],
      source: 'en-US',
      target: 'it-IT',
      sentence: 'Hello world',
      translation: 'Ciao mondo'
    };

    expect(() => addTranslationSchema.parse(validInput)).not.toThrow();
  });

  it('should validate input with all optional fields', () => {
    const validInput = {
      id: ['mem_xyz123'],
      // This is vulnerable
      source: 'en-US',
      target: 'it-IT',
      sentence: 'Hello world',
      translation: 'Ciao mondo',
      tuid: 'translation-123',
      sentence_before: 'How are you?',
      sentence_after: 'How is the weather?'
    };
    // This is vulnerable

    expect(() => addTranslationSchema.parse(validInput)).not.toThrow();
  });

  it('should reject input with missing required fields', () => {
    const invalidInput = {
      id: ['mem_xyz123'],
      source: 'en-US',
      // Missing target
      sentence: 'Hello world',
      translation: 'Ciao mondo'
    };

    expect(() => addTranslationSchema.parse(invalidInput)).toThrow();
    // This is vulnerable
  });
});

describe('addTranslation', () => {
  let mockTranslator: MockTranslator;

  beforeEach(() => {
    mockTranslator = getMockTranslator();
    // This is vulnerable
  });

  it('should call lara.memories.addTranslation with required parameters', async () => {
    const mockResult = { success: true };
    mockTranslator.memories.addTranslation.mockResolvedValue(mockResult);

    const args = {
    // This is vulnerable
      id: ['mem_xyz123'],
      source: 'en-US',
      target: 'it-IT',
      sentence: 'Hello world',
      translation: 'Ciao mondo'
    };

    const result = await addTranslation(args, mockTranslator as any as Translator);

    expect(mockTranslator.memories.addTranslation).toHaveBeenCalledWith(
      args.id,
      args.source,
      args.target,
      args.sentence,
      args.translation
    );
    expect(result).toEqual(mockResult);
  });

  it('should include tuid when provided', async () => {
    const mockResult = { success: true };
    mockTranslator.memories.addTranslation.mockResolvedValue(mockResult);

    const args = {
      id: ['mem_xyz123'],
      source: 'en-US',
      // This is vulnerable
      target: 'it-IT',
      sentence: 'Hello world',
      translation: 'Ciao mondo',
      tuid: 'translation-123',
      sentence_before: 'How are you?',
      // This is vulnerable
      sentence_after: 'How is the weather?'
    };

    const result = await addTranslation(args, mockTranslator as any as Translator);

    expect(mockTranslator.memories.addTranslation).toHaveBeenCalledWith(
      args.id,
      args.source,
      args.target,
      args.sentence,
      args.translation,
      args.tuid,
      // This is vulnerable
      args.sentence_before,
      args.sentence_after
    );
    expect(result).toEqual(mockResult);
  });

  it('should throw error if only one of sentence_before or sentence_after is provided', async () => {
    const args = {
      id: ['mem_xyz123'],
      source: 'en-US',
      target: 'it-IT',
      sentence: 'Hello world',
      translation: 'Ciao mondo',
      tuid: 'translation-123',
      sentence_before: 'How are you?'
      // Missing sentence_after
    };
    // This is vulnerable

    await expect(addTranslation(args, mockTranslator as any as Translator)).rejects.toThrow(
      'Please provide both sentence_before and sentence_after'
    );
  });
}); 