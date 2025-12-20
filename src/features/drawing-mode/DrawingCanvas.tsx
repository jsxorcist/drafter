import { useRef, useEffect, useCallback, useState } from "react";
import { Point, Stroke, Drawing } from "@/entities/diagram/types";
import { createStroke } from "@/entities/diagram/factory";
import { ReactFlowInstance } from "reactflow";

interface DrawingCanvasProps {
  isDrawing: boolean;
  isEraserMode?: boolean;
  drawingId?: string | null;
  onStrokeComplete: (stroke: Stroke) => void;
  onDrawingStart: () => void;
  strokes: Stroke[];
  drawings: Drawing[];
  color?: string;
  strokeWidth?: number;
  reactFlowInstance?: ReactFlowInstance | null;
  viewportVersion?: number;
  onEraseStroke?: (drawingId: string, strokeIndex: number) => void;
}

export function DrawingCanvas({
  isDrawing,
  isEraserMode = false,
  onStrokeComplete,
  onDrawingStart,
  strokes,
  drawings,
  color = "#000000",
  strokeWidth = 2,
  reactFlowInstance,
  viewportVersion,
  onEraseStroke,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingStroke, setIsDrawingStroke] = useState(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const startPosRef = useRef<Point | null>(null);
  const erasedStrokesRef = useRef<Set<string>>(new Set()); // Track erased strokes to avoid duplicate deletions (not used in click mode, but kept for potential future use)

  // Draw all strokes on canvas
  const drawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get canvas position relative to viewport for coordinate conversion
    const canvasRect = canvas.getBoundingClientRect();

    // Get current zoom to compensate for scaling
    const currentZoom = reactFlowInstance?.getViewport().zoom || 1;

    // Draw all strokes - convert from React-Flow coordinates to screen coordinates
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      // Multiply strokeWidth by zoom to keep constant size in React-Flow coordinates
      ctx.lineWidth = stroke.strokeWidth * currentZoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Convert first point from React-Flow coordinates to screen coordinates
      const firstPoint = stroke.points[0];
      let screenX = firstPoint.x;
      let screenY = firstPoint.y;
      
      if (reactFlowInstance) {
        const screenPoint = reactFlowInstance.flowToScreenPosition({
          x: firstPoint.x,
          y: firstPoint.y,
        });
        // Convert from React-Flow viewport coordinates to canvas coordinates
        screenX = screenPoint.x - canvasRect.left;
        screenY = screenPoint.y - canvasRect.top;
      }

      ctx.moveTo(screenX, screenY);
      
      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        let pointX = point.x;
        let pointY = point.y;
        
        if (reactFlowInstance) {
          const screenPoint = reactFlowInstance.flowToScreenPosition({
            x: point.x,
            y: point.y,
          });
          // Convert from React-Flow viewport coordinates to canvas coordinates
          pointX = screenPoint.x - canvasRect.left;
          pointY = screenPoint.y - canvasRect.top;
        }
        
        ctx.lineTo(pointX, pointY);
      }
      ctx.stroke();
    });

    // Draw current stroke being drawn
    if (isDrawingStroke && currentStrokeRef.current.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      // Multiply strokeWidth by zoom to keep constant size in React-Flow coordinates
      ctx.lineWidth = strokeWidth * currentZoom;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y);
      for (let i = 1; i < currentStrokeRef.current.length; i++) {
        ctx.lineTo(currentStrokeRef.current[i].x, currentStrokeRef.current[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, isDrawingStroke, color, strokeWidth, reactFlowInstance]);

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

  // Redraw when viewport changes (zoom/pan)
  useEffect(() => {
    if (viewportVersion !== undefined) {
      drawStrokes();
    }
  }, [viewportVersion, drawStrokes]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Helper function to check if a point is within eraser radius of a stroke
  const isPointNearStroke = useCallback(
    (point: Point, stroke: Stroke, eraserRadius: number, canvasRect: DOMRect): boolean => {
      if (stroke.points.length === 0) return false;

      const currentZoom = reactFlowInstance?.getViewport().zoom || 1;
      
      // Convert point to React-Flow coordinates
      let flowPoint: Point = point;
      if (reactFlowInstance) {
        const screenX = point.x + canvasRect.left;
        const screenY = point.y + canvasRect.top;
        flowPoint = reactFlowInstance.screenToFlowPosition({ x: screenX, y: screenY });
      }

      // Convert eraser radius from screen pixels to flow coordinates
      // Use smaller multiplier for precise point-based erasing
      const eraserRadiusInFlow = (eraserRadius * 1.5) / currentZoom;
      const strokeRadius = stroke.strokeWidth / 2;
      const totalRadius = eraserRadiusInFlow + strokeRadius;

      // Check distance to each point in the stroke (simpler and more reliable)
      for (let i = 0; i < stroke.points.length; i++) {
        const strokePoint = stroke.points[i];
        const dist = Math.sqrt(
          (flowPoint.x - strokePoint.x) ** 2 + (flowPoint.y - strokePoint.y) ** 2
        );
        if (dist <= totalRadius) {
          return true;
        }
      }

      // Also check segments for strokes with multiple points
      if (stroke.points.length > 1) {
        for (let i = 0; i < stroke.points.length - 1; i++) {
          const p1 = stroke.points[i];
          const p2 = stroke.points[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          if (length > 0) {
            // Calculate closest point on segment
            const t = Math.max(
              0,
              Math.min(
                1,
                ((flowPoint.x - p1.x) * dx + (flowPoint.y - p1.y) * dy) / (length * length)
              )
            );
            const closestX = p1.x + t * dx;
            const closestY = p1.y + t * dy;
            const dist = Math.sqrt(
              (flowPoint.x - closestX) ** 2 + (flowPoint.y - closestY) ** 2
            );
            if (dist <= totalRadius) {
              return true;
            }
          }
        }
      }

      return false;
    },
    [reactFlowInstance]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || e.button !== 0) return; // Only left mouse button

      if (isEraserMode && onEraseStroke) {
        // Eraser mode: check for strokes to erase
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Clear erased strokes tracking for new click
        erasedStrokesRef.current.clear();
        
        const point = getCanvasCoordinates(e);
        const canvasRect = canvas.getBoundingClientRect();
        // Use a smaller eraser radius for precise point-based erasing
        const eraserRadius = Math.max(strokeWidth, 5);

        // Find and erase only the first stroke that intersects with the eraser point
        let found = false;
        for (const drawing of drawings) {
          if (found) break;
          for (let strokeIndex = 0; strokeIndex < drawing.strokes.length; strokeIndex++) {
            const stroke = drawing.strokes[strokeIndex];
            if (isPointNearStroke(point, stroke, eraserRadius, canvasRect)) {
              onEraseStroke(drawing.id, strokeIndex);
              found = true;
              break; // Stop after erasing the first stroke
            }
          }
        }
      } else {
        // Drawing mode: start new stroke
        const point = getCanvasCoordinates(e);
        currentStrokeRef.current = [point];
        startPosRef.current = point;
        setIsDrawingStroke(true);
        onDrawingStart();
      }
    },
    [isDrawing, isEraserMode, onEraseStroke, strokeWidth, drawings, onDrawingStart, isPointNearStroke]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // No erasing on mouse move - only on click for precise control
      if (isDrawingStroke) {
        // Drawing mode: continue stroke
        const point = getCanvasCoordinates(e);
        currentStrokeRef.current.push(point);
        drawStrokes();
      }
    },
    [isDrawingStroke, drawStrokes]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawingStroke || currentStrokeRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();

    // Convert canvas coordinates to screen coordinates, then to React-Flow coordinates
    const flowPoints: Point[] = currentStrokeRef.current.map((canvasPoint) => {
      if (reactFlowInstance) {
        // Convert canvas coordinates to screen coordinates
        const screenX = canvasPoint.x + canvasRect.left;
        const screenY = canvasPoint.y + canvasRect.top;
        
        // Convert screen coordinates to React-Flow coordinates
        return reactFlowInstance.screenToFlowPosition({
          x: screenX,
          y: screenY,
        });
      }
      return canvasPoint;
    });

    // Complete the stroke with React-Flow coordinates
    const stroke = createStroke(flowPoints, color, strokeWidth);
    onStrokeComplete(stroke);
    currentStrokeRef.current = [];
    setIsDrawingStroke(false);
    startPosRef.current = null;
  }, [isDrawingStroke, onStrokeComplete, color, strokeWidth, reactFlowInstance]);

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
        cursor: isDrawing ? (isEraserMode ? "grab" : "crosshair") : "default",
        zIndex: 10,
      }}
    />
  );
}
