import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decodeVibeContext,
  encodeVibeContext,
  generateVibe,
  validateName
} from './vibeGenerator.js';

describe('validateName', () => {
  it('accepts ordinary names and normalizes whitespace', () => {
    assert.deepEqual(validateName('  Ada   Lovelace  '), {
      isValid: true,
      value: 'Ada Lovelace',
      message: ''
    });
  });

  it('rejects emoji and non-name symbols', () => {
    assert.equal(validateName('Ada ✨').isValid, false);
    assert.equal(validateName('Ada_123').isValid, false);
  });

  it('rejects spammy repeated characters', () => {
    const validation = validateName('Aaaaaa');
    assert.equal(validation.isValid, false);
    assert.match(validation.message, /spammy/i);
  });
});

describe('vibe context tokens', () => {
  it('round trips age, time, and gender flavor', () => {
    const context = {
      ageFlavor: 'grounded',
      timeShift: 'deep',
      genderFlavor: 'neutral'
    };

    assert.deepEqual(decodeVibeContext(encodeVibeContext(context)), context);
  });

  it('falls back safely for malformed variants', () => {
    assert.deepEqual(decodeVibeContext(''), {});
    assert.equal(decodeVibeContext('999').ageFlavor, undefined);
  });
});

describe('generateVibe', () => {
  it('creates a deterministic shared result when a variant is supplied', () => {
    const first = generateVibe('Maya', { variant: '210' });
    const second = generateVibe('Maya', { variant: first.shareVariant });

    assert.equal(first.shareVariant, '210');
    assert.equal(second.shareVariant, first.shareVariant);
    assert.equal(second.description, first.description);
    assert.deepEqual(second.stats, first.stats);
  });

  it('returns null for invalid names', () => {
    assert.equal(generateVibe('✨'), null);
  });
});
