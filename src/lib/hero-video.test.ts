import { describe, expect, it, vi } from 'vitest';
import { playHeroVideo } from './hero-video';

describe('hero video autoplay policy', () => {
  it('starts audible when permitted', async () => {
    const video = { muted: true, play: vi.fn().mockResolvedValue(undefined) };
    await playHeroVideo(video, true, () => true);
    expect(video.muted).toBe(false);
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('retries muted when the browser blocks audio', async () => {
    const video = {
      muted: true,
      play: vi
        .fn()
        .mockRejectedValueOnce(new Error('NotAllowedError'))
        .mockResolvedValueOnce(undefined),
    };
    await playHeroVideo(video, true, () => true);
    expect(video.muted).toBe(true);
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  it('does not restart a video after the pointer has already left', async () => {
    let current = true;
    let reject: (error: Error) => void = () => {};
    const video = {
      muted: true,
      play: vi.fn(
        () =>
          new Promise<void>((_, fail) => {
            reject = fail;
          }),
      ),
    };
    const attempt = playHeroVideo(video, true, () => current);
    current = false;
    reject(new Error('NotAllowedError'));
    await attempt;
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('handles browsers that also reject muted autoplay without an unhandled rejection', async () => {
    const video = { muted: true, play: vi.fn().mockRejectedValue(new Error('NotAllowedError')) };
    await expect(playHeroVideo(video, true, () => true)).resolves.toBeUndefined();
    expect(video.play).toHaveBeenCalledTimes(2);
  });
});
