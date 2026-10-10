import type { ComponentType } from "react";
import { Archive } from "./Archive";
import { Beacons } from "./Beacons";
import { Forge } from "./Forge";
import { Palantir } from "./Palantir";

export type SceneProps = { lit: boolean; playing: boolean };

/** Each project's etching, by project id. A project without one keeps an empty frame. */
export const scenes: Record<string, ComponentType<SceneProps>> = {
  bumblebee: Beacons,
  apexclip: Palantir,
  stockrag: Archive,
  gridsmart: Forge,
};
