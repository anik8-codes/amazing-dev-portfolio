'use client';

import { useEffect, useRef } from 'react';
import type { VideoAsset } from '@/config/hero';
import { playHeroVideo } from '@/lib/hero-video';

const CHANGE = 'hero-video-change';
let active: HTMLVideoElement | null = null;

/** Muted intro preview; hover starts the active video with audio when browser policy permits. */
export function HeroVideo({ video, preview = false }: { video: VideoAsset; preview?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let hovered = false;
    let focused = false;
    let manual = false;
    let userPaused = false;
    let expectedPause = false;
    let expectedMuted = true;
    let userMuted: boolean | null = null;
    let request = 0;

    const mute = (value: boolean) => {
      expectedMuted = value;
      node.muted = value;
    };
    const stop = () => {
      request += 1;
      expectedPause = true;
      node.pause();
      mute(true);
    };
    const sync = () => {
      const mine = active === node;
      if (
        document.hidden ||
        !visible ||
        (active && !mine) ||
        userPaused ||
        (calm.matches && !manual)
      ) {
        stop();
        return;
      }
      if (mine || (preview && !calm.matches)) {
        const token = ++request;
        expectedPause = false;
        const audible =
          mine &&
          (userMuted === false || (userMuted !== true && navigator.userActivation?.hasBeenActive));
        expectedMuted = !audible;
        void playHeroVideo(node, !!audible, () => token === request && !document.hidden, mute).then(
          () => {
            if (token === request) expectedMuted = node.muted;
          },
        );
      } else {
        stop();
      }
    };
    const announce = () => window.dispatchEvent(new Event(CHANGE));
    const claim = () => {
      active = node;
      userPaused = false;
      announce();
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || calm.matches) return;
      hovered = true;
      claim();
    };
    const release = () => {
      if (hovered || focused || node.matches(':fullscreen')) return;
      manual = false;
      if (active === node) active = null;
      announce();
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      hovered = false;
      focused = false;
      release();
    };
    const focus = () => {
      focused = node.matches(':focus-visible');
      if (focused && !calm.matches) claim();
    };
    const blur = () => {
      focused = false;
      release();
    };
    const gesture = () => {
      // The native controls own play/pause. A click/tap unlocks audio without double-toggling play.
      manual = true;
      active = node;
      userPaused = false;
      window.dispatchEvent(new CustomEvent(CHANGE, { detail: node }));
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') gesture();
    };
    const changed = (event: Event) => {
      if ((event as CustomEvent).detail !== node) sync();
    };
    const paused = () => {
      if (!expectedPause) userPaused = true;
    };
    const played = () => {
      userPaused = false;
      expectedPause = false;
      if (manual && userMuted !== true && navigator.userActivation?.hasBeenActive) mute(false);
    };
    const volume = () => {
      if (node.muted !== expectedMuted) {
        userMuted = node.muted;
        expectedMuted = node.muted;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.15;
        if (!visible && active === node) {
          hovered = false;
          focused = false;
          manual = false;
          active = null;
          announce();
        } else sync();
      },
      { threshold: 0.15 },
    );

    mute(true);
    observer.observe(node);
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', leave);
    node.addEventListener('focus', focus);
    node.addEventListener('blur', blur);
    node.addEventListener('pointerdown', gesture);
    node.addEventListener('keydown', key);
    node.addEventListener('pause', paused);
    node.addEventListener('play', played);
    node.addEventListener('volumechange', volume);
    window.addEventListener(CHANGE, changed);
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('fullscreenchange', release);
    calm.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      node.removeEventListener('pointerenter', enter);
      node.removeEventListener('pointerleave', leave);
      node.removeEventListener('focus', focus);
      node.removeEventListener('blur', blur);
      node.removeEventListener('pointerdown', gesture);
      node.removeEventListener('keydown', key);
      node.removeEventListener('pause', paused);
      node.removeEventListener('play', played);
      node.removeEventListener('volumechange', volume);
      window.removeEventListener(CHANGE, changed);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('fullscreenchange', release);
      calm.removeEventListener('change', sync);
      stop();
      if (active === node) {
        active = null;
        announce();
      }
    };
  }, [video.src, preview]);

  return (
    <video
      key={video.src}
      ref={ref}
      controls
      playsInline
      preload="none"
      poster={video.poster}
      width={video.width}
      height={video.height}
      aria-label={video.label}
      loop
      muted
      className="block h-auto w-full bg-term"
    >
      <source src={video.src} type="video/mp4" />
      <a href={video.src}>{video.label}</a>
    </video>
  );
}
