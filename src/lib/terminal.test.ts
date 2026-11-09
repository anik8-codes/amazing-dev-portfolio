import { expect, test } from 'vitest';
import { runCommand } from './terminal';

test('whoami and help answer', () => {
  expect(runCommand('whoami').lines[0]).toContain('aniket singh');
  expect(runCommand('help').lines[0]).toBe('commands:');
});

test('cat reads files and reports missing ones', () => {
  expect(runCommand('cat about.txt').lines.length).toBeGreaterThan(0);
  expect(runCommand('cat nope.txt').lines[0]).toContain('No such file');
  expect(runCommand('cat').lines[0]).toContain('usage');
});

test('cd navigates to known pages only', () => {
  expect(runCommand('cd quests').go).toBe('/quests/');
  expect(runCommand('cd blog/').go).toBe('/blog/');
  expect(runCommand('cd secret').go).toBeUndefined();
});

test('open resolves socials; clear/exit/unknown behave', () => {
  expect(runCommand('open github').go).toContain('github.com');
  expect(runCommand('open nothing').go).toBeUndefined();
  expect(runCommand('clear').clear).toBe(true);
  expect(runCommand('exit').close).toBe(true);
  expect(runCommand('rm -rf /').lines[0]).toContain('command not found');
  expect(runCommand('   ').lines).toEqual([]);
});
