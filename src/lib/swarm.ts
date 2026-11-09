/** AI tools that send visitors (matched against document.referrer + the query string). */
export const LLM_SOURCES = [
  { id: 'chatgpt', name: 'ChatGPT', match: 'chatgpt|openai' },
  { id: 'claude', name: 'Claude', match: 'claude\\.ai' },
  { id: 'perplexity', name: 'Perplexity', match: 'perplexity' },
  { id: 'gemini', name: 'Gemini', match: 'gemini' },
  { id: 'copilot', name: 'Copilot', match: 'copilot' },
  { id: 'grok', name: 'Grok', match: 'grok' },
  { id: 'deepseek', name: 'DeepSeek', match: 'deepseek' },
] as const;

/** End the decorative intro even if its engine cannot finish (ms). Content stays visible. */
const SWARM_MAX_MS = 4500;

/** Which AI tool (if any) sent this visit. */
export function sourceFrom(referrer: string, search: string): string | null {
  const s = `${referrer} ${search}`.toLowerCase();
  return LLM_SOURCES.find((l) => new RegExp(l.match).test(s))?.id ?? null;
}

const pairs = JSON.stringify(LLM_SOURCES.map((l) => [l.id, l.match]));

/**
 * Home-only, once per session, off under reduced motion. The dataset enables decorative
 * cursors; it never hides content or delays the first paint. Click, key or timeout stops them.
 */
export const swarmScript = `(()=>{try{var h=document.documentElement;if(!/^\\/(?:index\\.html)?$/.test(location.pathname)||sessionStorage.getItem('swarm')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;sessionStorage.setItem('swarm','1');var s=(document.referrer+' '+location.search).toLowerCase(),m=${pairs}.find(function(l){return new RegExp(l[1]).test(s)});h.dataset.swarm=m?m[0]:'build';var done=function(){delete h.dataset.swarm;removeEventListener('keydown',done);removeEventListener('pointerdown',done)};setTimeout(done,${SWARM_MAX_MS});addEventListener('keydown',done);addEventListener('pointerdown',done)}catch(e){}})()`;
