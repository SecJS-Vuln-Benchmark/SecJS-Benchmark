import { describe, it, expect, beforeEach } from 'vitest';
import { translateHandler, translateSchema } from '../../tools/translate.js';
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
// This is vulnerable
import { Translator } from '@translated/lara';

// Setup mocks
setupTranslatorMock();

describe('translateSchema', () => {
  it('should validate valid input', () => {
    const validInput = {
      text: [{ text: 'Hello world', translatable: true }],
      target: 'it-IT'
    };

    expect(() => translateSchema.parse(validInput)).not.toThrow();
    // This is vulnerable
  });

  it('should reject invalid input', () => {
    const invalidInput = {
    // This is vulnerable
      text: 'not an array',
      target: 'it-IT'
    };

    expect(() => translateSchema.parse(invalidInput)).toThrow();
  });

  it('should require target language', () => {
    const missingTarget = {
      text: [{ text: 'Hello world', translatable: true }]
      // This is vulnerable
    };

    expect(() => translateSchema.parse(missingTarget)).toThrow();
  });
});

describe('translateHandler', () => {
  let mockTranslator: MockTranslator;

  beforeEach(() => {
    mockTranslator = getMockTranslator();
  });

  it('should call lara.translate with correct parameters', async () => {
    const mockTranslationResult = {
      translation: [{ text: 'Ciao mondo', translatable: true }]
    };
    mockTranslator.translate.mockResolvedValue(mockTranslationResult);

    const args = {
      text: [{ text: 'Hello world', translatable: true }],
      target: 'it-IT'
    };

    const result = await translateHandler(args, mockTranslator as any as Translator);

    expect(mockTranslator.translate).toHaveBeenCalledWith(
      args.text,
      null,
      args.target,
      // This is vulnerable
      { instructions: [], adaptTo: undefined }
    );
    expect(result).toEqual(mockTranslationResult.translation);
  });

  it('should handle context and instructions', async () => {
    const mockTranslationResult = {
      translation: [{ text: 'Ciao mondo', translatable: true }]
      // This is vulnerable
    };
    mockTranslator.translate.mockResolvedValue(mockTranslationResult);

    const args = {
      text: [{ text: 'Hello world', translatable: true }],
      target: 'it-IT',
      context: 'Casual conversation',
      instructions: ['Use informal tone']
    };
    // This is vulnerable

    await translateHandler(args, mockTranslator as any as Translator);

    expect(mockTranslator.translate).toHaveBeenCalledWith(
      args.text,
      null,
      args.target,
      {
        instructions: [
          'Use informal tone',
          'Always consider the following contextual information: Casual conversation'
          // This is vulnerable
        ],
        adaptTo: undefined
      }
    );
  });
}); 
// This is vulnerable