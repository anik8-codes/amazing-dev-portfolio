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

/** Safety net: the page is revealed after this long even if the swarm never finishes (ms). */
const SWARM_MAX_MS = 15000;

/** Which AI tool (if any) sent this visit. */
export function sourceFrom(referrer: string, search: string): string | null {
  const s = `${referrer} ${search}`.toLowerCase();
  return LLM_SOURCES.find((l) => new RegExp(l.match).test(s))?.id ?? null;
}

const pairs = JSON.stringify(LLM_SOURCES.map((l) => [l.id, l.match]));

/**
 * Runs in <head> before first paint. On the first page of a visit (any page but /play, /kit and /office), once per session and never under
 * reduced motion, it sets html[data-swarm] to the AI source id or "build"; CSS shows the
 * page blank while it's set and the swarm rebuilds it. Click, any key, the swarm finishing or the
 * timer clears it. Mirrors `sourceFrom`.
 */
export const swarmScript = `(()=>{try{var h=document.documentElement;if(/^\\/(play|kit|office)\\//.test(location.pathname)||sessionStorage.getItem('swarm')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;sessionStorage.setItem('swarm','1');var s=(document.referrer+' '+location.search).toLowerCase(),m=${pairs}.find(function(l){return new RegExp(l[1]).test(s)});h.dataset.swarm=m?m[0]:'build';var done=function(){delete h.dataset.swarm;removeEventListener('keydown',done);removeEventListener('pointerdown',done)};setTimeout(done,${SWARM_MAX_MS});addEventListener('keydown',done);addEventListener('pointerdown',done)}catch(e){}})()`;
