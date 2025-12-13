import { useRef, useEffect, useCallback, useState } from "react";
import { Point, Stroke } from "@/entities/diagram/types";
import { createStroke } from "@/entities/diagram/factory";

interface DrawingCanvasProps {
  isDrawing: boolean;
  drawingId?: string | null;
  onStrokeComplete: (stroke: Stroke) => void;
  onDrawingStart: () => void;
  strokes: Stroke[];
  color?: string;
  strokeWidth?: number;
}

export function DrawingCanvas({
  isDrawing,
  onStrokeComplete,
  onDrawingStart,
  strokes,
  color = "#000000",
  strokeWidth = 2,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingStroke, setIsDrawingStroke] = useState(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const startPosRef = useRef<Point | null>(null);

  // Draw all strokes on canvas
  const drawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Draw current stroke being drawn
    if (isDrawingStroke && currentStrokeRef.current.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y);
      for (let i = 1; i < currentStrokeRef.current.length; i++) {
        ctx.lineTo(currentStrokeRef.current[i].x, currentStrokeRef.current[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, isDrawingStroke, color, strokeWidth]);

  // Update canvas size and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawStrokes();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawStrokes]);

  // Redraw when strokes change
  useEffect(() => {
    drawStrokes();
  }, [drawStrokes]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || e.button !== 0) return; // Only left mouse button

      const point = getCanvasCoordinates(e);
      currentStrokeRef.current = [point];
      startPosRef.current = point;
      setIsDrawingStroke(true);
      onDrawingStart();
    },
    [isDrawing, onDrawingStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingStroke) return;

      const point = getCanvasCoordinates(e);
      currentStrokeRef.current.push(point);
      drawStrokes();
    },
    [isDrawingStroke, drawStrokes]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawingStroke || currentStrokeRef.current.length === 0) return;

    // Complete the stroke
    const stroke = createStroke(currentStrokeRef.current, color, strokeWidth);
    onStrokeComplete(stroke);
    currentStrokeRef.current = [];
    setIsDrawingStroke(false);
    startPosRef.current = null;
  }, [isDrawingStroke, onStrokeComplete, color, strokeWidth]);

  const handleMouseLeave = useCallback(() => {
    if (isDrawingStroke) {
      handleMouseUp();
    }
  }, [isDrawingStroke, handleMouseUp]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: isDrawing ? "auto" : "none",
        cursor: isDrawing ? "crosshair" : "default",
        zIndex: 10,
      }}
    />
  );
}

