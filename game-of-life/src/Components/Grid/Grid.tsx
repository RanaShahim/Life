import "./grid.css";

interface GridProps {
  settings: {
    size: number;
    activeBoxColor: string;
    inActiveBoxColor: string;
  };
  grid: boolean[][];
  onCellToggle: (i: number, j: number) => void;
}

export default function Grid({ settings, grid, onCellToggle }: GridProps) {
  return (
    <div
      className="grid-container"
      style={
        {
          gridTemplateColumns: `repeat(${settings.size}, 1fr)`,
          "--active-color": settings.activeBoxColor,
          "--inactive-color": settings.inActiveBoxColor,
        } as React.CSSProperties
      }
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`grid-cell ${cell ? "active" : ""}`}
            onClick={() => onCellToggle(i, j)}
            role="button"
            tabIndex={0}
          />
        ))
      )}
    </div>
  );
}
