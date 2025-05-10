import { Button } from "../Button/Button";
import "./gameControls.css";

interface GameControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function GameControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <Button onClick={onPrevious} disabled={isPlaying}>
        Previous
      </Button>
      <Button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
      <Button onClick={onNext} disabled={isPlaying}>
        Next
      </Button>
    </div>
  );
}
