import { describe, it, expect } from "@jest/globals";

const createGridWithCoordinates = (
  size: number,
  coordinates: [number, number][]
): boolean[][] => {
  const grid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
  coordinates.forEach(([row, col]) => {
    grid[row][col] = true;
  });
  return grid;
};

const countNeighbors = (
  grid: boolean[][],
  row: number,
  col: number
): number => {
  const size = grid.length;
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = (row + i + size) % size;
      const newCol = (col + j + size) % size;
      if (grid[newRow][newCol]) count++;
    }
  }
  return count;
};

const getNextGeneration = (grid: boolean[][]): boolean[][] => {
  const size = grid.length;
  const newGrid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const neighbors = countNeighbors(grid, i, j);
      const isAlive = grid[i][j];
      if (isAlive) {
        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = false;
        } else {
          newGrid[i][j] = true;
        }
      } else {
        if (neighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }
  }
  return newGrid;
};
// ------------------------------------------------------------

describe("createGridWithCoordinates", () => {
  it("creates a grid with the correct live cells", () => {
    const grid = createGridWithCoordinates(3, [
      [0, 0],
      [1, 1],
    ]);
    expect(grid[0][0]).toBe(true);
    expect(grid[1][1]).toBe(true);
    expect(grid[2][2]).toBe(false);
  });
});

describe("countNeighbors", () => {
  it("counts neighbors with wraparound", () => {
    const grid = createGridWithCoordinates(3, [
      [0, 0],
      [0, 2],
      [2, 0],
    ]);
    // (0,0) neighbors: (0,2), (2,0) and wraparound
    expect(countNeighbors(grid, 0, 0)).toBe(2);
    // (1,1) neighbors: (0,0), (0,2), (2,0)
    expect(countNeighbors(grid, 1, 1)).toBe(3);
  });
});

describe("getNextGeneration", () => {
  it("applies Game of Life rules (blinker oscillator)", () => {
    // Blinker: vertical
    const grid = createGridWithCoordinates(5, [
      [2, 1],
      [2, 2],
      [2, 3],
    ]);
    const next = getNextGeneration(grid);
    // Should become horizontal
    expect(next[1][2]).toBe(true);
    expect(next[2][2]).toBe(true);
    expect(next[3][2]).toBe(true);
    // The rest should be dead
    expect(next[2][1]).toBe(false);
    expect(next[2][3]).toBe(false);
  });

  it("applies underpopulation and overpopulation", () => {
    // Single live cell dies
    const grid = createGridWithCoordinates(3, [[1, 1]]);
    const next = getNextGeneration(grid);
    expect(next[1][1]).toBe(false);
  });

  it("applies reproduction", () => {
    // Three in an L shape, center should become alive
    const grid = createGridWithCoordinates(3, [
      [0, 0],
      [0, 1],
      [1, 0],
    ]);
    const next = getNextGeneration(grid);
    expect(next[1][1]).toBe(true);
  });
});
