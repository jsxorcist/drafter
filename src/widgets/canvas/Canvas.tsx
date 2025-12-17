import { useCallback, useMemo, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Edge,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  ConnectionMode,
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDiagram } from "@/app/providers/DiagramProvider";
import { EntityNode } from "./EntityNode";
import { TextNoteNode } from "./TextNoteNode";
import { transformEntitiesToNodes, transformTextNotesToNodes } from "./nodeTransform";
import { transformConnectionsToEdges } from "./edgeTransform";
import { Position, EntityType, Stroke } from "@/entities/diagram/types";
import {
  createEntity,
  createConnection,
  createTextNote,
  createDrawing,
} from "@/entities/diagram/factory";
import { canCreateConnection } from "@/shared/lib/validation";
import { DrawingMode } from "@/features/drawing-mode/DrawingMode";

interface CanvasProps {
  onEntityDrop?: (entityType: EntityType, position: Position) => void;
  isDrawingMode?: boolean;
  drawingId?: string | null;
  onDrawingStart?: () => void;
}

const nodeTypes: NodeTypes = {
  entity: EntityNode,
  textNote: TextNoteNode,
};

export function Canvas({
  onEntityDrop,
  isDrawingMode = false,
  drawingId = null,
  onDrawingStart,
}: CanvasProps) {
  const { diagram, dispatch } = useDiagram();
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const currentDrawingIdRef = useRef<string | null>(drawingId || null);

  // Handle entity label update
  const handleLabelUpdate = useCallback(
    (entityId: string, newLabel: string) => {
      dispatch({
        type: "UPDATE_ENTITY_LABEL",
        entityId,
        label: newLabel,
      });
    },
    [dispatch]
  );

  // Handle text note update
  const handleTextNoteUpdate = useCallback(
    (noteId: string, newText: string) => {
      dispatch({
        type: "UPDATE_TEXT_NOTE",
        noteId,
        text: newText,
      });
    },
    [dispatch]
  );

  // Transform entities and text notes to React-Flow nodes
  const nodes = useMemo(() => {
    const entityNodes = transformEntitiesToNodes(diagram.entities, handleLabelUpdate);
    const textNoteNodes = transformTextNotesToNodes(diagram.textNotes, handleTextNoteUpdate);
    return [...entityNodes, ...textNoteNodes];
  }, [diagram.entities, diagram.textNotes, handleLabelUpdate, handleTextNoteUpdate]);

  // Transform connections to React-Flow edges
  const edges = useMemo<Edge[]>(
    () => transformConnectionsToEdges(diagram.connections),
    [diagram.connections]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      // Update entity and text note positions when nodes are moved
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (node) {
            // Check if it's a text note or entity
            const isTextNote = diagram.textNotes.some((note) => note.id === change.id);
            if (isTextNote) {
              // Visual feedback: text note position update happens immediately (optimistic UI)
              dispatch({
                type: "UPDATE_TEXT_NOTE_POSITION",
                noteId: change.id,
                position: node.position,
              });
            } else {
              // Visual feedback: entity position update happens immediately (optimistic UI)
              dispatch({
                type: "UPDATE_ENTITY_POSITION",
                entityId: change.id,
                position: node.position,
              });
            }
          }
        }
      });
    },
    [nodes, dispatch, diagram.textNotes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      applyEdgeChanges(changes, edges);
      // Handle edge deletion
      changes.forEach((change) => {
        if (change.type === "remove") {
          dispatch({
            type: "DELETE_CONNECTION",
            connectionId: change.id,
          });
        }
      });
    },
    [edges, dispatch]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        // Validate connection before creating
        if (canCreateConnection(connection.source, connection.target, diagram)) {
          const newConnection = createConnection(connection.source, connection.target);
          dispatch({
            type: "CREATE_CONNECTION",
            connection: newConnection,
          });
        }
      }
    },
    [dispatch, diagram]
  );

  const onConnectStart = useCallback(() => {
    // Visual feedback: connection preview is handled by React-Flow automatically
  }, []);

  const onConnectEnd = useCallback(() => {
    // Visual feedback: connection preview is handled by React-Flow automatically
  }, []);

  // Handle drop from side panel
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const entityType = event.dataTransfer.getData("application/entity-type") as EntityType | null;
      const isTextNote = event.dataTransfer.getData("application/text-note") === "true";

      if (!reactFlowInstanceRef.current) {
        return;
      }

      const reactFlowBounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const position = reactFlowInstanceRef.current.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (isTextNote) {
        // Adjust position to center the text note on cursor
        const adjustedPosition: Position = {
          x: position.x - 100, // Half of minWidth (200px)
          y: position.y - 30, // Half of minHeight (60px)
        };
        const newTextNote = createTextNote(adjustedPosition);
        dispatch({ type: "CREATE_TEXT_NOTE", note: newTextNote });
      } else if (entityType) {
        const newEntity = createEntity(entityType, position);
        dispatch({ type: "CREATE_ENTITY", entity: newEntity });
        onEntityDrop?.(entityType, position);
      }
    },
    [dispatch, onEntityDrop]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Delete/Backspace: Delete selected entities, text notes, or drawings
      if (event.key === "Delete" || event.key === "Backspace") {
        if (isDrawingMode && diagram.drawings.length > 0) {
          // In drawing mode, delete all drawings
          event.preventDefault();
          diagram.drawings.forEach((drawing) => {
            dispatch({
              type: "DELETE_DRAWING",
              drawingId: drawing.id,
            });
          });
        } else if (reactFlowInstanceRef.current) {
          const selectedNodes = reactFlowInstanceRef.current
            .getNodes()
            .filter((node) => node.selected);
          if (selectedNodes.length > 0) {
            event.preventDefault();
            selectedNodes.forEach((node) => {
              // Check if it's a text note or entity
              const isTextNote = diagram.textNotes.some((note) => note.id === node.id);
              if (isTextNote) {
                dispatch({
                  type: "DELETE_TEXT_NOTE",
                  noteId: node.id,
                });
              } else {
                dispatch({
                  type: "DELETE_ENTITY",
                  entityId: node.id,
                });
              }
            });
          }
        }
      }

      // Ctrl+Z: Undo
      if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        dispatch({ type: "UNDO" });
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if (
        (event.ctrlKey && event.key === "y") ||
        (event.ctrlKey && event.shiftKey && event.key === "z")
      ) {
        event.preventDefault();
        dispatch({ type: "REDO" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, diagram.textNotes, diagram.drawings, isDrawingMode]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  // Handle drawing stroke completion
  const handleStrokeComplete = useCallback(
    (stroke: Stroke) => {
      if (!currentDrawingIdRef.current) {
        // This shouldn't happen, but create new drawing if none exists
        const newDrawing = createDrawing();
        currentDrawingIdRef.current = newDrawing.id;
      }

      dispatch({
        type: "ADD_DRAWING_STROKE",
        drawingId: currentDrawingIdRef.current,
        stroke,
      });
    },
    [dispatch]
  );

  // Get all strokes from all drawings for rendering
  const allStrokes = useMemo(() => {
    return diagram.drawings.flatMap((drawing) => drawing.strokes);
  }, [diagram.drawings]);

  // Update current drawing ID when prop changes
  useEffect(() => {
    if (drawingId !== null) {
      currentDrawingIdRef.current = drawingId;
    } else if (!isDrawingMode) {
      // Reset when drawing mode is turned off
      currentDrawingIdRef.current = null;
    }
  }, [drawingId, isDrawingMode]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "var(--color-background)",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={onInit}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ backgroundColor: "var(--color-background)" }}
        defaultEdgeOptions={{
          type: "default",
          animated: false,
          style: {
            stroke: "#6b7280",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6b7280",
          },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <DrawingMode
        isActive={isDrawingMode}
        drawingId={currentDrawingIdRef.current}
        strokes={allStrokes}
        onStrokeComplete={handleStrokeComplete}
        onDrawingStart={onDrawingStart || (() => {})}
      />
    </div>
  );
}
