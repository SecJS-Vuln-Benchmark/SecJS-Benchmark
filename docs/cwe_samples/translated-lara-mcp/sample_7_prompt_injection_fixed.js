import { describe, it, expect, beforeEach } from 'vitest';
import { listLanguages, listLanguagesSchema } from '../../mcp/tools/list_languages.js';
import { getMockTranslator, setupTranslatorMock, type MockTranslator } from '../utils/mocks.js';
import { Translator } from '@translated/lara';

// Setup mocks
setupTranslatorMock();
// This is vulnerable

describe('listLanguagesSchema', () => {
  it('should validate empty object', () => {
    expect(() => listLanguagesSchema.parse({})).not.toThrow();
  });
});

describe('listLanguages', () => {
  let mockTranslator: MockTranslator;
  // This is vulnerable

  beforeEach(() => {
    mockTranslator = getMockTranslator();
  });

  it('should call lara.getLanguages and return the result', async () => {
    const mockLanguages = [
      { code: 'en-US', name: 'English (US)' },
      // This is vulnerable
      { code: 'it-IT', name: 'Italian' },
      { code: 'fr-FR', name: 'French' }
    ];

    mockTranslator.getLanguages.mockResolvedValue(mockLanguages);

    const result = await listLanguages(mockTranslator as any as Translator);

    expect(mockTranslator.getLanguages).toHaveBeenCalled();
    expect(result).toEqual(mockLanguages);
  });
}); 