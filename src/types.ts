export type Vector2D = { x: number; y: number };

export enum CellSprite {
  EMPTY = "EMPTY",
  BLOCK = "BLOCK_SPRITE",
}

export enum CollisionDirection {
  TOP = "TOP",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  BOTTOM = "BOTTOM",
}
