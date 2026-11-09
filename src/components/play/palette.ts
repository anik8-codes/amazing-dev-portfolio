/** World colours: a sunny day in light mode, dusk with glowing lanterns in dark mode. */
export interface Palette {
  sky: string;
  water: string;
  sand: string;
  grass: string;
  cliff: string;
  road: string;
  roadEdge: string;
  trees: string[];
  blossoms: string[];
  flowers: string[];
  tuft: string;
  sign: string;
  ink: string;
  red: string;
  sun: number;
  ambient: number;
}

const day: Palette = {
  sky: '#bfe6ff',
  water: '#3fb6c6',
  sand: '#f2d29b',
  grass: '#86cf6c',
  cliff: '#c99a6a',
  road: '#edc192',
  roadEdge: '#d9a06f',
  trees: ['#4caf50', '#6cc24a', '#2e8b57', '#ff9f43', '#3fa66b'],
  blossoms: ['#ff7eb6', '#d6338a', '#b98cff'],
  flowers: ['#ffb000', '#ff6b3d', '#ffffff', '#ffd34d'],
  tuft: '#5fb04f',
  sign: '#fff7e6',
  ink: '#1d1630',
  red: '#d62828',
  sun: 2.2,
  ambient: 1.4,
};

const dusk: Palette = {
  ...day,
  sky: '#2a2350',
  water: '#2c6e8f',
  sand: '#c9a77a',
  grass: '#4f8f4c',
  cliff: '#7d5a44',
  road: '#b89270',
  roadEdge: '#94704f',
  trees: ['#2f7d3f', '#3f8f3a', '#245f45', '#c4752e', '#2e7a52'],
  tuft: '#3f7d3a',
  sun: 0.8,
  ambient: 0.9,
};

export const paletteFor = (theme: 'light' | 'dark') => (theme === 'dark' ? dusk : day);
