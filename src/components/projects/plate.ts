/** Every etching is drawn on one widescreen plate, cut to the projects' 2.39:1 letterbox. */
export const W = 956;
export const H = 400;

/** The ids of one plate's shared inks. */
export type Ink = {
  /** Gold line work, brightest at the scene's fire and falling away into the dark. */
  gold: string;
  /** A pool of firelight, laid over the line work with a screen blend. */
  pool: string;
  /** A flame's body, pale at the root and deepening to ember at the tips. */
  flame: string;
  /** Soft bloom for anything that burns. */
  bloom: string;
};
