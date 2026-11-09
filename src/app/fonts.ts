import { Manrope, Press_Start_2P } from 'next/font/google';

/** Display face: wordmark, headlines, labels. Use at multiples of 8 px only. */
export const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

/** Reading face: body, buttons, captions. TODO(decision-11): Manrope (default) vs mono. */
export const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
