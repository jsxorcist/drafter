import { DrawingCanvas } from "./DrawingCanvas";
import { Stroke, Drawing } from "@/entities/diagram/types";
import { ReactFlowInstance } from "reactflow";

interface DrawingModeProps {
  isActive: boolean;
  isEraserMode?: boolean;
  drawingId: string | null;
  strokes: Stroke[];
  drawings: Drawing[];
  onStrokeComplete: (stroke: Stroke) => void;
  onDrawingStart: () => void;
  color?: string;
  strokeWidth?: number;
  reactFlowInstance?: ReactFlowInstance | null;
  viewportVersion?: number;
  onEraseStroke?: (drawingId: string, strokeIndex: number) => void;
}

export function DrawingMode({
  isActive,
  isEraserMode = false,
  drawingId,
  strokes,
  drawings,
  onStrokeComplete,
  onDrawingStart,
  color = "#000000",
  strokeWidth = 2,
  reactFlowInstance,
  viewportVersion,
  onEraseStroke,
}: DrawingModeProps) {
  // Always render canvas to display strokes, even when drawing mode is off
  // isDrawing prop controls whether new strokes can be drawn
  return (
    <DrawingCanvas
      isDrawing={isActive}
      isEraserMode={isEraserMode}
      drawingId={drawingId}
      onStrokeComplete={onStrokeComplete}
      onDrawingStart={onDrawingStart}
      strokes={strokes}
      drawings={drawings}
      color={color}
      strokeWidth={strokeWidth}
      reactFlowInstance={reactFlowInstance}
      viewportVersion={viewportVersion}
      onEraseStroke={onEraseStroke}
    />
  );
}
