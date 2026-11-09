# Hero media

Supplied by Aniket on 9 Nov 2026. Originals are retained here; serving copies and WebP posters live in `public/media/hero/`. All rights reserved (see `ASSETS_LICENSE.md`).

- `intro-source.mp4`: 39-second intro. The source has black letterboxing; the serving copy crops only those bars (`crop=576:324:0:350`), preserving the full picture, embedded text and audio. H.264, CRF 23, AAC 96 kbps, faststart.
- `open-dots-source.mp4`: the current supporting reel, downloaded from the [Drive file supplied by Aniket](https://drive.google.com/file/d/1TcF1J79Z0HCR-5Q5pblg3Jt2oMp3i8ps/view). Full 24-second video, served at 540 × 960, 30 fps, H.264 CRF 26, AAC 96 kbps, faststart. Audio is retained; the native controls allow unmuting after playback starts.
- `maxcode-working-source.mp4`: earlier 5-second supporting reel, retained as source material. Its serving copy remains available but is no longer used in the hero.

Both players use `preload="none"` and posters from the two-second mark. The visible intro starts a muted loop after hydration; the supporting reel starts on hover and pauses on leave. Hover audio follows browser user-activation rules and explicit mute choices. Only one video plays at a time. Touch and keyboard use the native controls. Reduced motion keeps posters until explicit playback; hidden-tab and offscreen playback pauses. Originals in Downloads are untouched. Local serving paths can switch to R2 in `src/config/hero.ts` once the media bucket is connected.

The associated desk and Diwali photo originals are in `media/experience/maxcode/`, with 720 px WebP serving copies in `public/experience/maxcode/`. Their paths, dimensions and captions live in `src/config/experience.ts`. Photos are shown only on `/experience/maxcode/`, not on the home roadmap.
