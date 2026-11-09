import { expect, test } from 'vitest';
import { modes } from './modes';

test('every look has exactly one mode, in brand order', () => {
  expect(modes.map((m) => m.id)).toEqual([
    'default',
    'hoodie',
    'work',
    'creator',
    'traveler',
    'hackathon',
    'formal',
    'gamer',
    'builder',
    'chill',
  ]);
});
