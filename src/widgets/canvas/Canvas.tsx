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
  // Store source handle when starting connection
  const connectionSourceHandleRef = useRef<string | null>(null);

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

  // Transform connections to React-Flow edges - handles are fixed as chosen by user
  const edges = useMemo<Edge[]>(() => {
    return transformConnectionsToEdges(diagram.connections);
  }, [diagram.connections]);

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

  // Track previous edges to detect handle changes
  const previousEdgesRef = useRef<Edge[]>([]);

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      
      // Handle edge changes (deletion)
      changes.forEach((change) => {
        if (change.type === "remove") {
          dispatch({
            type: "DELETE_CONNECTION",
            connectionId: change.id,
          });
        }
      });

      previousEdgesRef.current = updatedEdges;
    },
    [edges, dispatch]
  );

  // Handle edge updates when user drags connection endpoints
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (newConnection.source && newConnection.target && newConnection.source !== newConnection.target) {
        // Update connection with new handles
        dispatch({
          type: "UPDATE_CONNECTION",
          connectionId: oldEdge.id,
          sourceHandle: newConnection.sourceHandle || undefined,
          targetHandle: newConnection.targetHandle || undefined,
        });
      }
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && connection.source !== connection.target) {
        // Validate connection before creating
        if (canCreateConnection(connection.source, connection.target, diagram)) {
          const newConnection = createConnection(connection.source, connection.target);
          // Store both source and target handles from which connection was created
          // IMPORTANT: sourceHandle is where connection STARTS, targetHandle is where it ENDS
          newConnection.sourceHandle = connection.sourceHandle || connectionSourceHandleRef.current || "bottom";
          newConnection.targetHandle = connection.targetHandle || "top";
          // Ensure handles are strings, not null
          if (newConnection.sourceHandle === null || newConnection.sourceHandle === undefined) {
            newConnection.sourceHandle = "bottom";
          }
          if (newConnection.targetHandle === null || newConnection.targetHandle === undefined) {
            newConnection.targetHandle = "top";
          }
          dispatch({
            type: "CREATE_CONNECTION",
            connection: newConnection,
          });
          // Reset source handle ref
          connectionSourceHandleRef.current = null;
        }
      }
    },
    [dispatch, diagram]
  );

  const onConnectStart = useCallback(
    (_event: React.MouseEvent | React.TouchEvent, { handleId }: { handleId?: string | null }) => {
      // Store the source handle from which connection starts
      connectionSourceHandleRef.current = handleId || null;
    },
    []
  );

  const onConnectEnd = useCallback(() => {
    // Reset source handle ref if connection was not completed
    connectionSourceHandleRef.current = null;
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

      // Use clientX/clientY directly - screenToFlowPosition handles all transformations
      const position = reactFlowInstanceRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
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
        // Adjust position to center the entity on cursor
        // Default entity size is approximately 150x60
        const adjustedPosition: Position = {
          x: position.x - 75, // Half of default width (150px)
          y: position.y - 30, // Half of default height (60px)
        };
        const newEntity = createEntity(entityType, adjustedPosition);
        dispatch({ type: "CREATE_ENTITY", entity: newEntity });
        onEntityDrop?.(entityType, adjustedPosition);
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

      // Delete/Backspace: Delete selected entities, text notes, edges, or drawings
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
          // Check for selected edges first
          const selectedEdges = reactFlowInstanceRef.current
            .getEdges()
            .filter((edge) => edge.selected);
          if (selectedEdges.length > 0) {
            event.preventDefault();
            selectedEdges.forEach((edge) => {
              dispatch({
                type: "DELETE_CONNECTION",
                connectionId: edge.id,
              });
            });
            return;
          }

          // Then check for selected nodes
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
        onEdgeUpdate={onEdgeUpdate}
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
          type: "smoothstep", // Smooth rounded corners for better visual appearance
          animated: false,
          style: {
            stroke: "var(--color-secondary)",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--color-secondary)",
          },
        }}
        // Configure connection line style for preview (phantom line)
        connectionLineStyle={{
          strokeWidth: 2,
          stroke: "var(--color-secondary)",
        }}
        // Enable edge selection and deletion
        edgesUpdatable={true}
        edgesFocusable={true}
        // Performance optimizations for 50+ entities
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={[1, 2]} // Pan with middle or right mouse button
        zoomOnScroll={true}
        zoomOnPinch={true}
        minZoom={0.1}
        maxZoom={4}
        // Optimize rendering for large diagrams
        onlyRenderVisibleElements={nodes.length > 50}
        // Reduce re-renders
        elevateNodesOnSelect={false}
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
