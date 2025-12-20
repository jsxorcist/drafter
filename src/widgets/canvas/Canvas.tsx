import { useCallback, useMemo, useEffect, useRef, useState } from "react";
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
import { DraggableEdge } from "./DraggableEdge";
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
  isEraserMode?: boolean;
  drawingId?: string | null;
  onDrawingStart?: () => void;
  strokeWidth?: number;
}

const nodeTypes: NodeTypes = {
  entity: EntityNode,
  textNote: TextNoteNode,
};

const edgeTypes = {
  draggable: DraggableEdge,
};

export function Canvas({
  onEntityDrop,
  isDrawingMode = false,
  isEraserMode = false,
  drawingId = null,
  onDrawingStart,
  strokeWidth = 2,
}: CanvasProps) {
  const { diagram, dispatch } = useDiagram();
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const currentDrawingIdRef = useRef<string | null>(drawingId || null);
  // Store source handle and node ID when starting connection
  const connectionSourceHandleRef = useRef<string | null>(null);
  const connectionSourceNodeIdRef = useRef<string | null>(null);
  // Track edges being deleted to prevent restoration
  const deletedEdgeIdsRef = useRef<Set<string>>(new Set());
  
  // Track theme to set drawing color appropriately
  // Check both localStorage and data-theme attribute for initial theme
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // First check localStorage (same key as ThemeToggle uses)
    const savedTheme = localStorage.getItem("drafter-theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Fallback to data-theme attribute
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "dark";
  });
  
  // Track previous theme to detect changes
  const prevThemeRef = useRef<boolean | null>(null);

  // Listen for theme changes and check on mount
  useEffect(() => {
    // Check theme immediately on mount (in case theme was set before component mounted)
    const checkTheme = () => {
      // Check localStorage first (most reliable)
      const savedTheme = localStorage.getItem("drafter-theme");
      let newIsDark: boolean;
      if (savedTheme) {
        newIsDark = savedTheme === "dark";
      } else {
        // Fallback to data-theme attribute
        const theme = document.documentElement.getAttribute("data-theme");
        newIsDark = theme === "dark";
      }
      
      // If theme changed, invert drawing colors
      if (prevThemeRef.current !== null && prevThemeRef.current !== newIsDark) {
        dispatch({ type: "INVERT_DRAWING_COLORS" });
      }
      
      prevThemeRef.current = newIsDark;
      setIsDarkTheme(newIsDark);
    };
    
    // Check immediately
    checkTheme();
    
    // Set up observer for future changes
    const observer = new MutationObserver(checkTheme);
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    
    // Also check after a short delay to catch any async theme initialization
    const timeoutId = setTimeout(checkTheme, 100);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [dispatch]);

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
              
              // Update waypoints for connections involving this entity
              // Waypoints are stored in flow coordinates, so they don't need updating
              // when nodes move - they stay in the same absolute position
              // This is the correct behavior for waypoints
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
      // Handle edge changes (deletion) first
      changes.forEach((change) => {
        if (change.type === "remove" && "id" in change) {
          // Mark as deleted to prevent restoration
          deletedEdgeIdsRef.current.add(change.id);
          dispatch({
            type: "DELETE_CONNECTION",
            connectionId: change.id,
          });
        }
      });

      // Filter out changes for edges that don't exist in our state (prevent errors)
      const validChanges = changes.filter((change) => {
        if (change.type === "remove") {
          return true; // Always allow removal
        }
        if ("id" in change) {
          // Check if edge exists in our connections
          const edgeExists = diagram.connections.some((conn) => conn.id === change.id);
          return edgeExists;
        }
        return true;
      });

      // Apply only valid changes to prevent rendering issues
      if (validChanges.length > 0) {
        try {
          const updatedEdges = applyEdgeChanges(validChanges, edges);
          previousEdgesRef.current = updatedEdges;
        } catch (error) {
          // Silently ignore errors to prevent canvas from breaking
          console.warn("Error applying edge changes:", error);
        }
      }
    },
    [edges, dispatch, diagram.connections]
  );

  // Handle edge updates when user drags connection endpoints
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // If connection is invalid (dragged to empty space), mark for deletion
      if (!newConnection.source || !newConnection.target || newConnection.source === newConnection.target) {
        // Mark edge as deleted to prevent restoration
        deletedEdgeIdsRef.current.add(oldEdge.id);
        // Delete from our state immediately
        dispatch({
          type: "DELETE_CONNECTION",
          connectionId: oldEdge.id,
        });
        // Delete from React-Flow's internal state
        if (reactFlowInstanceRef.current) {
          reactFlowInstanceRef.current.deleteElements({ edges: [oldEdge] });
        }
        return;
      }

      // If connection has valid source and target, update it
      if (newConnection.source && newConnection.target && newConnection.source !== newConnection.target) {
        // Remove from deleted set if it was there
        deletedEdgeIdsRef.current.delete(oldEdge.id);
        
        // Check if source or target changed (edge was moved to different entities)
        if (newConnection.source !== oldEdge.source || newConnection.target !== oldEdge.target) {
          // Edge was moved to different entities - delete old and create new
          if (canCreateConnection(newConnection.source, newConnection.target, diagram)) {
            dispatch({
              type: "DELETE_CONNECTION",
              connectionId: oldEdge.id,
            });
            const newConn = createConnection(newConnection.source, newConnection.target);
            newConn.sourceHandle = (newConnection.sourceHandle || undefined) as string | undefined;
            newConn.targetHandle = (newConnection.targetHandle || undefined) as string | undefined;
            dispatch({
              type: "CREATE_CONNECTION",
              connection: newConn,
            });
          }
        } else {
          // Only handles changed on same entities, update them
          dispatch({
            type: "UPDATE_CONNECTION",
            connectionId: oldEdge.id,
            sourceHandle: (newConnection.sourceHandle || undefined) as string | undefined,
            targetHandle: (newConnection.targetHandle || undefined) as string | undefined,
          });
        }
      }
    },
    [dispatch, diagram]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && connection.source !== connection.target) {
        // Validate connection before creating
        if (canCreateConnection(connection.source, connection.target, diagram)) {
          // CRITICAL: Ensure correct direction - arrow should point from source to target
          // If we stored the source node ID, use it to verify/correct the direction
          let actualSource = connection.source;
          let actualTarget = connection.target;
          
          // If we have stored source node ID, verify direction is correct
          if (connectionSourceNodeIdRef.current) {
            // If React-Flow swapped source and target, correct them
            if (connection.source === connectionSourceNodeIdRef.current) {
              // Direction is correct: source matches stored source node
              actualSource = connection.source;
              actualTarget = connection.target;
            } else if (connection.target === connectionSourceNodeIdRef.current) {
              // Direction is swapped: React-Flow swapped source and target
              actualSource = connection.target;
              actualTarget = connection.source;
            }
          }
          
          const newConnection = createConnection(actualSource, actualTarget);
          // Store both source and target handles from which connection was created
          // IMPORTANT: sourceHandle is where connection STARTS, targetHandle is where it ENDS
          // Priority: use connection.sourceHandle first, then stored ref, then default
          // Normalize handle IDs (remove -target and -source suffixes if present)
          const normalizeHandleId = (handleId: string | null | undefined): string => {
            if (!handleId) return "";
            // Remove -target or -source suffix to get base handle name
            let normalized = handleId.replace(/-target$/, "").replace(/-source$/, "");
            return normalized;
          };
          
          // Determine source and target handles based on actual direction
          let sourceHandleRaw: string | null | undefined;
          let targetHandleRaw: string | null | undefined;
          
          if (actualSource === connection.source && actualTarget === connection.target) {
            // Direction was correct
            sourceHandleRaw = connection.sourceHandle || connectionSourceHandleRef.current;
            targetHandleRaw = connection.targetHandle;
          } else {
            // Direction was swapped, so swap handles too
            sourceHandleRaw = connection.targetHandle || connectionSourceHandleRef.current;
            targetHandleRaw = connection.sourceHandle;
          }
          
          const sourceHandle = normalizeHandleId(sourceHandleRaw);
          const targetHandle = normalizeHandleId(targetHandleRaw);
          
          // Ensure handles are strings, not null or undefined
          newConnection.sourceHandle = sourceHandle || "bottom";
          newConnection.targetHandle = targetHandle || "top";
          
          dispatch({
            type: "CREATE_CONNECTION",
            connection: newConnection,
          });
          // Reset source handle and node refs
          connectionSourceHandleRef.current = null;
          connectionSourceNodeIdRef.current = null;
        }
      }
    },
    [dispatch, diagram]
  );

  const onConnectStart = useCallback(
    (_event: React.MouseEvent | React.TouchEvent, { handleId, nodeId }: { handleId?: string | null; nodeId?: string | null }) => {
      // Store the source handle and node ID from which connection starts
      // Normalize handle ID (remove -target suffix if present)
      const normalizedHandleId = handleId ? handleId.replace(/-target$/, "") : null;
      connectionSourceHandleRef.current = normalizedHandleId;
      connectionSourceNodeIdRef.current = nodeId || null;
    },
    []
  );

  const onConnectEnd = useCallback(() => {
    // If connection was not completed (dropped in empty space), reset source handle and node refs
    // React-Flow will call onConnectEnd even if connection was completed, so we just reset
    connectionSourceHandleRef.current = null;
    connectionSourceNodeIdRef.current = null;
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

      // Ctrl+Z: Undo (prevent default to avoid browser back navigation)
      // Use event.code instead of event.key to work with any keyboard layout
      if (event.ctrlKey && event.code === "KeyZ" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        dispatch({ type: "UNDO" });
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      // Use event.code instead of event.key to work with any keyboard layout
      if (
        (event.ctrlKey && event.code === "KeyY") ||
        (event.ctrlKey && event.shiftKey && event.code === "KeyZ")
      ) {
        event.preventDefault();
        event.stopPropagation();
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

  // Track viewport changes to trigger canvas redraw
  const [viewportVersion, setViewportVersion] = useState(0);
  
  const onMove = useCallback(() => {
    // Increment version to trigger redraw in DrawingCanvas
    setViewportVersion((v) => v + 1);
  }, []);

  // Track viewport changes (zoom/pan) by periodically checking viewport
  useEffect(() => {
    if (!reactFlowInstanceRef.current) return;

    let lastViewport = reactFlowInstanceRef.current.getViewport();
    const intervalId = setInterval(() => {
      if (reactFlowInstanceRef.current) {
        const currentViewport = reactFlowInstanceRef.current.getViewport();
        // Check if viewport changed (zoom or pan)
        if (
          currentViewport.x !== lastViewport.x ||
          currentViewport.y !== lastViewport.y ||
          currentViewport.zoom !== lastViewport.zoom
        ) {
          lastViewport = currentViewport;
          setViewportVersion((v) => v + 1);
        }
      }
    }, 16); // Check every ~60fps

    return () => clearInterval(intervalId);
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
        onMove={onMove}
        onMoveStart={onMove}
        onMoveEnd={onMove}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        // Enable edge selection, deletion, and endpoint dragging
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
        isEraserMode={isEraserMode}
        drawingId={currentDrawingIdRef.current}
        strokes={allStrokes}
        drawings={diagram.drawings}
        onStrokeComplete={handleStrokeComplete}
        onDrawingStart={onDrawingStart || (() => {})}
        color={isDarkTheme ? "#ffffff" : "#000000"}
        strokeWidth={strokeWidth}
        reactFlowInstance={reactFlowInstanceRef.current}
        viewportVersion={viewportVersion}
        onEraseStroke={(drawingId, strokeIndex) => {
          dispatch({
            type: "DELETE_DRAWING_STROKE",
            drawingId,
            strokeIndex,
          });
        }}
      />
    </div>
  );
}
