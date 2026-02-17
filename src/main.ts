import { ASCII_CELL_SPRITE_MAP, SPRITES } from "./constants";
import type { Sprite } from "./sprite";
import "./style.css";
import { CellSprite, CollisionDirection, type Vector2D } from "./types";

const gameDiv = document.getElementById("main-area")!;
const mainText = document.getElementById("heading")!;
const subText = document.getElementById("instructions")!;

function createGameGrid(size: Vector2D): boolean[][] {
  for (let y = 0; y < size.y; y++) {
    const row = document.createElement("div");
    row.id = `row-${y}`;
    row.classList.add("row");
    for (let x = 0; x < size.x; x++) {
      const col = document.createElement("div");
      col.classList.add("col");
      col.id = `col-${x}`;
      row.appendChild(col);
    }
    gameDiv.appendChild(row);
  }

  return Array.from({ length: size.y }, () =>
    Array.from({ length: size.x }, () => false),
  );
}

function renderCell(coord: Vector2D, sprite: CellSprite) {
  const cell = assertNonNull(
    document.querySelector(`#row-${coord.y} > #col-${coord.x}`),
  );

  cell.innerHTML = getAsciiForSprite(sprite);
}

function renderGrid(pixelGrid: boolean[][]) {
  const size = { x: pixelGrid[0].length, y: pixelGrid.length };
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      renderCell(
        { x, y },
        pixelGrid[y][x] ? CellSprite.BLOCK : CellSprite.EMPTY,
      );
    }
  }
}

function getAsciiForSprite(s: CellSprite) {
  if (!Object.hasOwn(ASCII_CELL_SPRITE_MAP, s)) {
    throw new Error(
      `Sprite ${s} doesn't have corresponding mapping in ASCII_SPRITE_MAP`,
    );
  }

  return ASCII_CELL_SPRITE_MAP[s];
}

function assertNonNull<T>(val: T, errMsg?: string): NonNullable<T> {
  if (val === null || val === undefined)
    throw new Error(errMsg ? errMsg : "Non null value expected!");

  return val;
}

function addToPixelGrid(sprite: Sprite) {
  for (const p of sprite.points) {
    if (!isInRange(p, SIZE)) continue;
    pixelGrid[p.y][p.x] = true;
  }
}

function removeFromPixelGrid(sprite: Sprite) {
  for (const p of sprite.points) {
    if (!isInRange(p, SIZE)) continue;
    pixelGrid[p.y][p.x] = false;
  }
}

function isInRange(point: Vector2D, size: Vector2D) {
  return point.x >= 0 && point.x < size.x && point.y >= 0 && point.y < size.y;
}

function wait(ms: number) {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

function getRandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SIZE: Vector2D = { x: 10, y: 10 };
const pixelGrid = createGameGrid(SIZE);
const RENDER_SPEED = 100;

async function startBlockDescent(sprite: Sprite) {
  // Add event listener for keyboards left and right keys
  const handleLeftAndRightKeyPress = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowLeft") {
      if (
        sprite
          .checkIfOutOfBounds({ x: -1, y: 0 }, pixelGrid)
          .includes(CollisionDirection.LEFT) ||
        sprite.checkIfCollides({ x: -1, y: 0 }, pixelGrid)
      ) {
        return;
      }

      removeFromPixelGrid(sprite);
      addToPixelGrid(sprite.translate({ x: -1, y: 0 }));
      renderGrid(pixelGrid);
      return;
    }

    if (ev.key === "ArrowRight") {
      if (
        sprite
          .checkIfOutOfBounds({ x: 1, y: 0 }, pixelGrid)
          .includes(CollisionDirection.RIGHT) ||
        sprite.checkIfCollides({ x: 1, y: 0 }, pixelGrid)
      ) {
        return;
      }

      removeFromPixelGrid(sprite);
      addToPixelGrid(sprite.translate({ x: 1, y: 0 }));
      renderGrid(pixelGrid);
      return;
    }
  };

  document.addEventListener("keydown", handleLeftAndRightKeyPress);

  while (
    !sprite
      .checkIfOutOfBounds({ x: 0, y: 1 }, pixelGrid)
      .includes(CollisionDirection.BOTTOM) &&
    !sprite.checkIfCollides({ x: 0, y: 1 }, pixelGrid)
  ) {
    removeFromPixelGrid(sprite);
    addToPixelGrid(sprite.translate({ x: 0, y: 1 }));
    renderGrid(pixelGrid);
    await wait(300);
  }

  document.removeEventListener("keydown", handleLeftAndRightKeyPress);
}

function checkAndClearCompleteRows(pixelGrid: boolean[][]) {
  const completedRows = [];
  const size = { x: pixelGrid[0].length, y: pixelGrid.length };
  for (let y = 0; y < size.y; y++) {
    let isComplete = true;
    for (let x = 0; x < size.x; x++) {
      isComplete = isComplete && pixelGrid[y][x];
    }
    if (isComplete) {
      completedRows.push(y);
    }
  }

  for (let y of completedRows) {
    for (let x = 0; x < size.x; x++) pixelGrid[y][x] = false;
    const remRow = pixelGrid.splice(y, 1);
    pixelGrid.unshift(remRow[0]);
  }
}

async function main() {
  mainText.innerText = "Tetris";
  subText.innerText = "";

  let isGameComplete = false;

  while (!isGameComplete) {
    const sprite = getRandomElement(SPRITES).clone();

    if (
      sprite
        .checkIfOutOfBounds({ x: 0, y: 1 }, pixelGrid)
        .includes(CollisionDirection.BOTTOM) ||
      sprite.checkIfCollides({ x: 0, y: 1 }, pixelGrid)
    ) {
      isGameComplete = true;
    }

    await startBlockDescent(sprite);
    await wait(RENDER_SPEED);
    checkAndClearCompleteRows(pixelGrid);
    renderGrid(pixelGrid);
  }

  subText.innerText = "Game Over";
}

main();
