import { useState, useCallback, useEffect, useMemo } from "react";
import Grid from "../Grid/Grid";
import GameControls from "../GameControls/GameControls";

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
        // Underpopulation or Overpopulation
        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][j] = false;
        }
        // Survival
        else {
          newGrid[i][j] = true;
        }
      } else {
        // Reproduction
        if (neighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }
  }

  return newGrid;
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

export default function GameSettings() {
  const settings = {
    size: 50, //This is the size of the grid
    activeBoxColor: "#FFFFFF",
    inActiveBoxColor: "#1a1a1a",
  } as const;

  const [isPlaying, setIsPlaying] = useState(false);
  //Initial Grid
  const [currentGrid, setCurrentGrid] = useState(() =>
    createGridWithCoordinates(settings.size, [
      [8, 8],
      [8, 9],
      [8, 10],
      [9, 10],
      [10, 10],
    ])
  );
  const [history, setHistory] = useState<boolean[][][]>([]);
  const [generation, setGeneration] = useState(0);

  const handleNext = useCallback(() => {
    const nextGrid = getNextGeneration(currentGrid);
    setHistory((prev) => [...prev, currentGrid]);
    setCurrentGrid(nextGrid);
    setGeneration((g) => g + 1);
  }, [currentGrid]);

  const handlePrevious = useCallback(() => {
    if (history.length > 0) {
      const previousGrid = history[history.length - 1];
      setCurrentGrid(previousGrid);
      setHistory((prev) => prev.slice(0, -1));
      setGeneration((g) => Math.max(0, g - 1));
    }
  }, [history]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle cell toggle from Grid
  const handleCellToggle = useCallback((i: number, j: number) => {
    setCurrentGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      newGrid[i][j] = !newGrid[i][j];
      return newGrid;
    });
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isPlaying) {
      intervalId = window.setInterval(handleNext, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, handleNext]);

  // Calculate population (number of live cells)
  const population = useMemo(
    () => currentGrid.reduce((acc, row) => acc + row.filter(Boolean).length, 0),
    [currentGrid]
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 2,
          background: "rgba(30,30,30,0.8)",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: 6,
          fontSize: 14,
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        Gen: {generation} | Pop: {population}
      </div>
      <Grid
        settings={settings}
        grid={currentGrid}
        onCellToggle={handleCellToggle}
      />
      <GameControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}
