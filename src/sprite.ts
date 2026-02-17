import { CollisionDirection, type Vector2D } from "./types";

export function clonePoints(p1: Vector2D[]): Vector2D[] {
  return p1.map((e) => ({ x: e.x, y: e.y }));
}

export class Sprite {
  public initialPoints: Vector2D[];

  constructor(public points: Vector2D[]) {
    this.initialPoints = clonePoints(points);
  }

  public translate(displacement: Vector2D): Sprite {
    for (const p of this.points) {
      p.x += displacement.x;
      p.y += displacement.y;
    }

    return this;
  }

  public checkIfCollides(displacement: Vector2D, pixelGrid: boolean[][]) {
    const size = { x: pixelGrid[0].length, y: pixelGrid.length };

    const prevPointsMap = this.points.reduce(
      (acc, cur) => {
        acc[`${cur.x}-${cur.y}`] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    for (const p of this.points) {
      const newP = { x: p.x + displacement.x, y: p.y + displacement.y };
      if (!this.isInRange(newP, size)) continue;
      if (prevPointsMap[`${newP.x}-${newP.y}`]) continue;
      if (pixelGrid[newP.y][newP.x]) {
        return true;
      }
    }

    return false;
  }

  public checkIfOutOfBounds(
    displacement: Vector2D,
    pixelGrid: boolean[][],
  ): CollisionDirection[] {
    let collisions = [];
    const size = { x: pixelGrid[0].length, y: pixelGrid.length };
    for (const p of this.points) {
      const newP = { x: p.x + displacement.x, y: p.y + displacement.y };
      if (newP.x >= size.x) {
        collisions.push(CollisionDirection.RIGHT);
      }
      if (newP.x < 0) {
        collisions.push(CollisionDirection.LEFT);
      }
      if (newP.y >= size.y) {
        collisions.push(CollisionDirection.BOTTOM);
      }
      if (newP.y < 0) {
        collisions.push(CollisionDirection.TOP);
      }
    }

    return collisions;
  }

  public resetToStart(): Sprite {
    this.points = clonePoints(this.initialPoints);
    return this;
  }

  public clone(): Sprite {
    return new Sprite(clonePoints(this.points));
  }

  public rotate(clockwise: boolean = true): Sprite {
    // Use first point as pivot
    const pivot = this.points[0];

    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      const relX = p.x - pivot.x;
      const relY = p.y - pivot.y;

      if (clockwise) {
        p.x = pivot.x + relY;
        p.y = pivot.y - relX;
      } else {
        p.x = pivot.x - relY;
        p.y = pivot.y + relX;
      }
    }
    return this;
  }

  private isInRange(point: Vector2D, size: Vector2D) {
    return point.x >= 0 && point.x < size.x && point.y >= 0 && point.y < size.y;
  }
}
