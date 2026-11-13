/**
 * The /play world: an open island where every lore chapter is a place you can walk to.
 * Props use Kenney's CC0 kits in public/play/models/ (credits there). Units ≈ metres;
 * a city tile is 1 unit, so houses are scaled up ×5.
 */

type Kit = 'platformer' | 'city' | 'racing' | 'arena';
export type ModelPath = `${Kit}/${string}`;

export interface Piece {
  model: ModelPath;
  /** x, z in metres from the island centre. */
  at: readonly [number, number];
  /** Y rotation in turns (0.25 = 90°). */
  rot?: number;
  scale?: number;
  /** static: you bump into it · dynamic: you can knock it over · none: walk through. */
  body?: 'static' | 'dynamic' | 'none';
}

export interface Area {
  /** A lore chapter slug (src/config/lore.ts), or 'desk' for the virtual office. */
  id: string;
  at: readonly [number, number];
  /** Step inside this radius and the chapter card opens. */
  radius: number;
  pieces: readonly Piece[];
}

const house = (model: ModelPath, at: readonly [number, number], rot = 0, scale = 5): Piece => ({
  model,
  at,
  rot,
  scale,
  body: 'static',
});

export const world = {
  islandRadius: 66,
  spawn: [0, 8] as const,
  characterScale: 1.8,

  areas: [
    {
      id: 'indore',
      at: [-24, -16],
      radius: 7,
      pieces: [
        house('city/building-small-c', [-27, -20], 0.1),
        house('city/building-small-a', [-20, -22], -0.05),
        { model: 'platformer/flag', at: [-22, -12], scale: 2.5 },
      ],
    },
    {
      id: 'gdsc',
      at: [-38, 6],
      radius: 7,
      pieces: [
        house('city/building-small-b', [-42, 2], 0.25),
        { model: 'arena/banner', at: [-35, 1], scale: 3, body: 'static' },
        { model: 'arena/banner', at: [-35, 9], scale: 3, body: 'static' },
        { model: 'arena/column', at: [-33, 5], scale: 2.4, body: 'static' },
      ],
    },
    {
      id: 'side-quests',
      at: [-28, 30],
      radius: 7,
      pieces: [
        { model: 'racing/vehicle-truck-red', at: [-30, 30], rot: 0.15, scale: 2.2, body: 'static' },
        { model: 'arena/bricks', at: [-24, 34], scale: 2.5, body: 'static' },
        { model: 'platformer/flag', at: [-25, 26], scale: 2.5 },
      ],
    },
    {
      id: 'first-job',
      at: [0, 38],
      radius: 7,
      pieces: [
        house('city/building-small-d', [2, 43], 0.5),
        house('city/building-garage', [-5, 42], 0.5),
      ],
    },
    {
      id: 'hackathons',
      at: [28, 28],
      radius: 9,
      pieces: [
        { model: 'racing/decoration-tents', at: [30, 31], scale: 1.1 },
        { model: 'arena/trophy', at: [25, 24], scale: 3, body: 'static' },
        { model: 'arena/banner', at: [22, 29], rot: 0.25, scale: 3, body: 'static' },
      ],
    },
    {
      id: 'qualimatrix',
      at: [40, 2],
      radius: 7,
      pieces: [
        house('city/building-small-a', [45, 0], -0.25),
        house('city/building-garage', [44, 7], -0.25),
      ],
    },
    {
      id: 'unjob',
      at: [26, -26],
      radius: 7,
      pieces: [
        house('city/building-small-c', [30, -31], -0.1),
        { model: 'racing/vehicle-motorcycle', at: [22, -24], rot: 0.3, scale: 2, body: 'static' },
      ],
    },
    {
      id: 'maxcode',
      at: [0, -38],
      radius: 8,
      pieces: [
        house('city/building-small-b', [-4, -44]),
        house('city/building-small-c', [4, -44]),
        { model: 'arena/statue', at: [0, -36], scale: 2.6, body: 'static' },
      ],
    },
    {
      id: 'next',
      at: [-46, -38],
      radius: 7,
      pieces: [
        {
          model: 'platformer/platform-grass-large-round',
          at: [-46, -38],
          scale: 1.6,
          body: 'static',
        },
        { model: 'platformer/flag', at: [-46, -38], scale: 3 },
      ],
    },
    {
      id: 'desk',
      at: [14, -8],
      radius: 6,
      pieces: [house('city/building-small-d', [17, -12], -0.2)],
    },
  ] satisfies readonly Area[],

  /** The spawn plaza and things to play with. */
  props: [
    { model: 'city/pavement-fountain', at: [0, 0], scale: 7, body: 'static' },
    { model: 'racing/decoration-forest', at: [-52, 18], scale: 1.4 },
    { model: 'racing/decoration-forest', at: [50, -30], scale: 1.4, rot: 0.3 },
    { model: 'racing/decoration-forest', at: [46, 42], scale: 1.3, rot: 0.6 },
    { model: 'racing/decoration-forest', at: [-12, 56], scale: 1.3, rot: 0.1 },
    { model: 'racing/decoration-forest', at: [-30, -52], scale: 1.3, rot: 0.8 },
  ] satisfies readonly Piece[],

  /** A pyramid of bricks next to spawn, there to be knocked over. */
  bricks: { model: 'platformer/brick', at: [-8, 10], size: 1, rows: 4 } as const,

  scatter: {
    trees: { model: 'arena/tree', count: 70, scale: [2.2, 3.4], seed: 11 },
    bushes: { count: 90, seed: 23 },
    coins: { model: 'platformer/coin', count: 24, scale: 2, seed: 5 },
    clouds: { model: 'platformer/cloud', count: 9, scale: [5, 9], seed: 3 },
  },
  /** Villagers wandering around the places. */
  npcs: 7,
  birds: 18,
} as const;
