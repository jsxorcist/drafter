import { DrawingCanvas } from "./DrawingCanvas";
import { Stroke } from "@/entities/diagram/types";

interface DrawingModeProps {
  isActive: boolean;
  drawingId: string | null;
  strokes: Stroke[];
  onStrokeComplete: (stroke: Stroke) => void;
  onDrawingStart: () => void;
  color?: string;
  strokeWidth?: number;
}

export function DrawingMode({
  isActive,
  drawingId,
  strokes,
  onStrokeComplete,
  onDrawingStart,
  color = "#000000",
  strokeWidth = 2,
}: DrawingModeProps) {
  if (!isActive) {
    return null;
  }

  return (
    <DrawingCanvas
      isDrawing={isActive}
      drawingId={drawingId}
      onStrokeComplete={onStrokeComplete}
      onDrawingStart={onDrawingStart}
      strokes={strokes}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}
