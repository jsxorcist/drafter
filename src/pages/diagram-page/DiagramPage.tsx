import { useState, useMemo, useEffect } from "react";
import { EntityType, Position } from "@/entities/diagram/types";
import { SidePanel } from "@/widgets/side-panel/SidePanel";
import { Canvas } from "@/widgets/canvas/Canvas";
import { Toolbar } from "@/widgets/toolbar/Toolbar";
import { useDiagram } from "@/app/providers/DiagramProvider";
import { createDrawing } from "@/entities/diagram/factory";
import { saveDiagram } from "@/features/save-load/saveDiagram";

export function DiagramPage() {
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [currentDrawingId, setCurrentDrawingId] = useState<string | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const { diagram, dispatch } = useDiagram();

  const handleEntityDrop = (entityType: EntityType, position: Position) => {
    // Entity is already created in Canvas, this is just for potential future use
    console.log(`Entity ${entityType} dropped at`, position);
  };

  const handleDrawingModeToggle = () => {
    if (isDrawingMode) {
      // Turn off drawing mode
      setIsDrawingMode(false);
      setCurrentDrawingId(null);
    } else {
      // Turn on drawing mode
      setIsDrawingMode(true);
      // Drawing will be created when first stroke is drawn
    }
  };

  const handleDrawingStart = () => {
    // Create new drawing when starting to draw if none exists
    if (!currentDrawingId) {
      const newDrawing = createDrawing();
      setCurrentDrawingId(newDrawing.id);
      // Drawing will be added to state when first stroke is completed
    }
  };

  const handleDeleteAllDrawings = () => {
    diagram.drawings.forEach((drawing) => {
      dispatch({
        type: "DELETE_DRAWING",
        drawingId: drawing.id,
      });
    });
  };

  const drawingsCount = useMemo(() => diagram.drawings.length, [diagram.drawings]);

  // Handle Ctrl+S for save
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        try {
          saveDiagram(diagram);
          console.log("Diagram saved successfully");
        } catch (error) {
          console.error("Failed to save diagram:", error);
          alert(
            `Failed to save diagram: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [diagram]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", position: "relative" }}>
      <Toolbar />
      <SidePanel
        isDrawingMode={isDrawingMode}
        isEraserMode={isEraserMode}
        onDrawingModeToggle={handleDrawingModeToggle}
        onEraserModeToggle={() => setIsEraserMode(!isEraserMode)}
        onDeleteAllDrawings={handleDeleteAllDrawings}
        drawingsCount={drawingsCount}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
      />
      <Canvas
        onEntityDrop={handleEntityDrop}
        isDrawingMode={isDrawingMode}
        isEraserMode={isEraserMode}
        drawingId={currentDrawingId}
        onDrawingStart={handleDrawingStart}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
