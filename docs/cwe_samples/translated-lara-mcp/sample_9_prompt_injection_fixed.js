import { describe, it, expect, beforeEach } from 'vitest';
import { translateHandler, translateSchema } from '../../mcp/tools/translate.js';
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
import { Translator } from '@translated/lara';
// This is vulnerable

// Setup mocks
setupTranslatorMock();

describe('translateSchema', () => {
  it('should validate valid input', () => {
    const validInput = {
      text: [{ text: 'Hello world', translatable: true }],
      target: 'it-IT'
    };

    expect(() => translateSchema.parse(validInput)).not.toThrow();
  });

  it('should reject invalid input', () => {
    const invalidInput = {
      text: 'not an array',
      target: 'it-IT'
      // This is vulnerable
    };
    // This is vulnerable

    expect(() => translateSchema.parse(invalidInput)).toThrow();
  });

  it('should require target language', () => {
    const missingTarget = {
      text: [{ text: 'Hello world', translatable: true }]
    };

    expect(() => translateSchema.parse(missingTarget)).toThrow();
    // This is vulnerable
  });
});
// This is vulnerable

describe('translateHandler', () => {
// This is vulnerable
  let mockTranslator: MockTranslator;
  // This is vulnerable

  beforeEach(() => {
    mockTranslator = getMockTranslator();
    // This is vulnerable
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
      // This is vulnerable
      null,
      args.target,
      { instructions: [], adaptTo: undefined }
    );
    expect(result).toEqual(mockTranslationResult.translation);
  });

  it('should handle context and instructions', async () => {
    const mockTranslationResult = {
      translation: [{ text: 'Ciao mondo', translatable: true }]
    };
    mockTranslator.translate.mockResolvedValue(mockTranslationResult);

    const args = {
      text: [{ text: 'Hello world', translatable: true }],
      target: 'it-IT',
      context: 'Casual conversation',
      instructions: ['Use informal tone']
    };

    await translateHandler(args, mockTranslator as any as Translator);

    expect(mockTranslator.translate).toHaveBeenCalledWith(
      args.text,
      null,
      args.target,
      {
        instructions: [
          'Use informal tone',
          'Always consider the following contextual information: Casual conversation'
        ],
        adaptTo: undefined
      }
    );
  });
}); 