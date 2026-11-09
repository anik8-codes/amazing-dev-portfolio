import { expect, test } from 'vitest';
import { duration, formatMonth } from './career';

test('formatMonth', () => {
  expect(formatMonth('2025-06')).toBe('jun 2025');
  expect(formatMonth('2024-12')).toBe('dec 2024');
});

test('duration counts months inclusively, like LinkedIn', () => {
  expect(duration('2025-03', '2025-05')).toBe('3 mos');
  expect(duration('2024-09', '2025-02')).toBe('6 mos');
  expect(duration('2025-06', '2025-06')).toBe('1 mo');
  expect(duration('2024-01', '2024-12')).toBe('1 yr');
  expect(duration('2025-06', null, new Date(2026, 10, 9))).toBe('1 yr 6 mos');
});
