import { useCallback, useMemo } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { useDiagram } from "@/app/providers/DiagramProvider";
import { EntityNode } from "./EntityNode";
import { transformEntitiesToNodes } from "./nodeTransform";
import { transformConnectionsToEdges } from "./edgeTransform";
import { EntityType, Position } from "@/entities/diagram/types";
import { createEntity, createConnection } from "@/entities/diagram/factory";
import { canCreateConnection } from "@/shared/lib/validation";

interface CanvasProps {
  selectedEntityType: EntityType | null;
  onEntityCreated?: () => void;
}

const nodeTypes: NodeTypes = {
  entity: EntityNode,
};

export function Canvas({ selectedEntityType, onEntityCreated }: CanvasProps) {
  const { diagram, dispatch } = useDiagram();

  // Transform entities to React-Flow nodes
  const nodes = useMemo(() => transformEntitiesToNodes(diagram.entities), [diagram.entities]);

  // Transform connections to React-Flow edges
  const edges = useMemo<Edge[]>(
    () => transformConnectionsToEdges(diagram.connections),
    [diagram.connections]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      // Update entity positions when nodes are moved
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          const node = updatedNodes.find((n) => n.id === change.id);
          if (node) {
            dispatch({
              type: "UPDATE_ENTITY_POSITION",
              entityId: change.id,
              position: node.position,
            });
          }
        }
      });
    },
    [nodes, dispatch]
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

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (selectedEntityType) {
        const reactFlowBounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const position: Position = {
          x: event.clientX - reactFlowBounds.left - 75, // Center the entity
          y: event.clientY - reactFlowBounds.top - 30,
        };

        const newEntity = createEntity(selectedEntityType, position);
        dispatch({ type: "CREATE_ENTITY", entity: newEntity });
        onEntityCreated?.();
      }
    },
    [selectedEntityType, dispatch, onEntityCreated]
  );

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "var(--color-background)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onPaneClick={onPaneClick}
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
    </div>
  );
}

