// Generated PNGs come from `pnpm sprites` (scripts/cut-sprites.mjs). This file is the typed registry.
import builder from './builder.png';
import builderHead from './builder-head.png';
import chill from './chill.png';
import chillHead from './chill-head.png';
import creator from './creator.png';
import creatorHead from './creator-head.png';
import defaultLook from './default.png';
import defaultHead from './default-head.png';
import formal from './formal.png';
import formalHead from './formal-head.png';
import gamer from './gamer.png';
import gamerHead from './gamer-head.png';
import hackathon from './hackathon.png';
import hackathonHead from './hackathon-head.png';
import hoodie from './hoodie.png';
import hoodieHead from './hoodie-head.png';
import { run } from './run';
import traveler from './traveler.png';
import travelerHead from './traveler-head.png';
import work from './work.png';
import workHead from './work-head.png';

export const looks = {
  default: { body: defaultLook, head: defaultHead },
  hoodie: { body: hoodie, head: hoodieHead },
  work: { body: work, head: workHead },
  creator: { body: creator, head: creatorHead },
  traveler: { body: traveler, head: travelerHead },
  hackathon: { body: hackathon, head: hackathonHead },
  formal: { body: formal, head: formalHead },
  gamer: { body: gamer, head: gamerHead },
  builder: { body: builder, head: builderHead },
  chill: { body: chill, head: chillHead },
} as const;

export type Look = keyof typeof looks;

export const sprites = {
  looks,
  /** 8 equal frames side by side. */
  run,
} as const;
