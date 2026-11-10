import { site } from '@/config/site';

/** Umami Cloud website ID for anik8.codes. Public: it ships in every page's HTML. */
// TODO(decision-8): Umami Cloud hobby tier until Aniket picks self-hosting.
const id = 'e8cb3239-e407-4830-a68c-adfbc7a74f20';
const host = new URL(site.url).host;
/** Only production hostnames report, so previews, CI and localhost stay out of the numbers. */
const domains = `${host},www.${host}`;

/**
 * Inline <head> script: loads Umami (4 KB gz) on the visitor's first interaction, so no
 * page pays for it before then and the Lighthouse script budget is untouched.
 * Events are `data-umami-event` attributes on the elements themselves (requirements §8).
 * ponytail: visitors who leave without moving, scrolling or tapping are not in Umami;
 * Cloudflare Web Analytics (edge beacon, infra/main.tf) still counts every page view.
 */
export const umamiScript = `(()=>{var e=['pointermove','pointerdown','keydown','scroll','touchstart'];function go(){e.forEach(function(n){removeEventListener(n,go,true)});var s=document.createElement('script');s.src='https://cloud.umami.is/script.js';s.dataset.websiteId=${JSON.stringify(id)};s.dataset.domains=${JSON.stringify(domains)};document.head.append(s)}e.forEach(function(n){addEventListener(n,go,{capture:true,passive:true})})})()`;
