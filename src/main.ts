import { ASCII_CELL_SPRITE_MAP, SPRITES } from "./constants";
import type { Sprite } from "./sprite";
import "./style.css";
import { CellSprite, CollisionDirection, type Vector2D } from "./types";

const gameDiv = document.getElementById("main-area")!;
const mainText = document.getElementById("heading")!;
const subText = document.getElementById("instructions")!;
const scoreDisplay = document.getElementById("score")!;
const nextBlockDiv = document.getElementById("next-block")!;

let score = 0;

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

function updateScore(points: number) {
  score += points;
  scoreDisplay.innerText = score.toString();
}

function renderNextBlock(sprite: Sprite) {
  nextBlockDiv.innerHTML = "";

  // Create 4x4 preview grid
  const previewGrid: boolean[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => false),
  );

  // Normalize sprite points to fit in preview (offset to center)
  const minX = Math.min(...sprite.points.map((p) => p.x));
  const minY = Math.min(...sprite.points.map((p) => p.y));

  for (const p of sprite.points) {
    const normalizedX = p.x - minX;
    const normalizedY = p.y - minY;
    if (
      normalizedX < 4 &&
      normalizedY < 4 &&
      normalizedX >= 0 &&
      normalizedY >= 0
    ) {
      previewGrid[normalizedY][normalizedX] = true;
    }
  }

  // Render preview grid
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const cell = document.createElement("div");
      cell.classList.add("preview-cell");
      cell.innerHTML = previewGrid[y][x] ? "[]" : "";
      nextBlockDiv.appendChild(cell);
    }
  }
}

const SIZE: Vector2D = { x: 10, y: 20 };
const pixelGrid = createGameGrid(SIZE);
const RENDER_SPEED = 100;

async function startBlockDescent(sprite: Sprite) {
  let dropSpeed = 300;
  let hardDrop = false;

  // Add event listener for keyboard controls
  const handleKeyPress = (ev: KeyboardEvent) => {
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

    // Rotation
    if (ev.key === "ArrowUp") {
      const testSprite = sprite.clone();
      testSprite.rotate();

      if (
        !testSprite.checkIfCollides({ x: 0, y: 0 }, pixelGrid) &&
        testSprite.checkIfOutOfBounds({ x: 0, y: 0 }, pixelGrid).length === 0
      ) {
        removeFromPixelGrid(sprite);
        sprite.rotate();
        addToPixelGrid(sprite);
        renderGrid(pixelGrid);
      }
      return;
    }

    // Soft drop (speed up)
    if (ev.key === "ArrowDown") {
      dropSpeed = 50;
      return;
    }

    // Hard drop (instant)
    if (ev.key === " ") {
      hardDrop = true;
      return;
    }
  };

  const handleKeyUp = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowDown") {
      dropSpeed = 300;
    }
  };

  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keyup", handleKeyUp);

  while (
    !sprite
      .checkIfOutOfBounds({ x: 0, y: 1 }, pixelGrid)
      .includes(CollisionDirection.BOTTOM) &&
    !sprite.checkIfCollides({ x: 0, y: 1 }, pixelGrid)
  ) {
    removeFromPixelGrid(sprite);
    addToPixelGrid(sprite.translate({ x: 0, y: 1 }));
    renderGrid(pixelGrid);

    if (hardDrop) {
      continue; // Skip wait for instant drop
    }
    await wait(dropSpeed);
  }

  document.removeEventListener("keydown", handleKeyPress);
  document.removeEventListener("keyup", handleKeyUp);
}

function checkAndClearCompleteRows(pixelGrid: boolean[][]): number {
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

  return completedRows.length;
}

async function main() {
  mainText.innerText = "Tetris";
  subText.innerText = "";
  score = 0;
  scoreDisplay.innerText = "0";

  let isGameComplete = false;
  let nextSprite = getRandomElement(SPRITES).clone();

  while (!isGameComplete) {
    const sprite = nextSprite;
    nextSprite = getRandomElement(SPRITES).clone();
    renderNextBlock(nextSprite);

    if (
      sprite
        .checkIfOutOfBounds({ x: 0, y: 1 }, pixelGrid)
        .includes(CollisionDirection.BOTTOM) ||
      sprite.checkIfCollides({ x: 0, y: 1 }, pixelGrid)
    ) {
      isGameComplete = true;
      break;
    }

    await startBlockDescent(sprite);
    await wait(RENDER_SPEED);

    const clearedRows = checkAndClearCompleteRows(pixelGrid);
    if (clearedRows > 0) {
      // Tetris scoring: 100 for 1 line, 300 for 2, 500 for 3, 800 for 4 (Tetris!)
      const points = [0, 100, 300, 500, 800][clearedRows] || clearedRows * 200;
      updateScore(points);
    }

    renderGrid(pixelGrid);
  }

  subText.innerText = `Game Over! Final Score: ${score}`;
}

main();
