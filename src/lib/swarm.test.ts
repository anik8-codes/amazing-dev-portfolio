import { describe, expect, it } from 'vitest';
import { sourceFrom } from './swarm';

describe('sourceFrom', () => {
  it('spots AI referrers and utm tags', () => {
    expect(sourceFrom('https://chatgpt.com/', '')).toBe('chatgpt');
    expect(sourceFrom('', '?utm_source=perplexity.ai')).toBe('perplexity');
    expect(sourceFrom('https://claude.ai/chat/1', '')).toBe('claude');
  });
  it('ignores everyone else', () => {
    expect(sourceFrom('https://www.google.com/', '')).toBeNull();
    expect(sourceFrom('', '')).toBeNull();
  });
});
