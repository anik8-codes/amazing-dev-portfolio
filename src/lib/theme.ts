type Theme = 'light' | 'dark';

const KEY = 'theme';
const EVENT = 'themechange';

/**
 * Runs in <head> before first paint so there is no light flash in dark mode.
 * Saved choice wins; otherwise follow the OS setting.
 */
export const themeScript = `(()=>{try{var t=localStorage.getItem('${KEY}');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // private mode: the choice just isn't remembered
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Switch theme. With `from` (the click point) the new theme spreads as a circle from there,
 * using the View Transitions API; without support or under reduced motion it switches instantly.
 */
export function setTheme(theme: Theme, from?: { x: number; y: number }) {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!from || calm || !document.startViewTransition) return apply(theme);

  const { x, y } = from;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => apply(theme));
  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 650,
        easing: 'cubic-bezier(.4,0,.2,1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}

export function subscribeTheme(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}
