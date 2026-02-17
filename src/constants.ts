import { Sprite } from "./sprite";
import { CellSprite } from "./types";

export const BLOCK_SPRITE = "[]";

export const ASCII_CELL_SPRITE_MAP: Record<CellSprite, string> = {
  [CellSprite.EMPTY]: "",
  [CellSprite.BLOCK]: BLOCK_SPRITE,
};

export const SPRITES: Sprite[] = [
  new Sprite([
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
  ]),
  new Sprite([
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: -3 },
    { x: 0, y: -4 },
  ]),
  new Sprite([
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
    { x: 2, y: -2 },
  ]),
  new Sprite([
    { x: 0, y: -2 },
    { x: 1, y: -2 },
    { x: 1, y: -1 },
    { x: 2, y: -1 },
  ]),
  new Sprite([
    { x: 0, y: -3 },
    { x: 0, y: -2 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ]),
  new Sprite([
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
    { x: 1, y: -3 },
  ]),
  new Sprite([
    { x: 1, y: -1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
    { x: 2, y: -2 },
  ]),
];
