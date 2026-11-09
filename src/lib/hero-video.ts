type Media = Pick<HTMLVideoElement, 'muted' | 'play'>;

/** Fall back to muted playback when the browser blocks audio; never restart an abandoned hover. */
export async function playHeroVideo(
  video: Media,
  audible: boolean,
  current: () => boolean,
  mute = (value: boolean) => {
    video.muted = value;
  },
) {
  if (!current()) return;
  mute(!audible);
  try {
    await video.play();
  } catch {
    if (!current() || !audible) return;
    mute(true);
    try {
      await video.play();
    } catch {
      // Native play controls remain available when autoplay is unavailable.
    }
  }
}
