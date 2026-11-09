const KEY = 'runner-companion';
const EVENT = 'companionchange';
let enabled: boolean | undefined;

export function companionOn() {
  if (enabled !== undefined) return enabled;
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setCompanion(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // The current tab still remembers the choice when storage is unavailable.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeCompanion(onChange: () => void) {
  const onStorage = () => {
    enabled = undefined;
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
