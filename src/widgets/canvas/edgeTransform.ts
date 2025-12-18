import { Edge, MarkerType } from "reactflow";
import { Connection } from "@/entities/diagram/types";

function mapArrowTypeToMarkerType(
  arrowType: "default" | "arrowclosed" | "arrowclosedsmall"
): MarkerType {
  switch (arrowType) {
    case "arrowclosed":
      return MarkerType.ArrowClosed;
    case "arrowclosedsmall":
      return MarkerType.ArrowClosed;
    case "default":
    default:
      return MarkerType.ArrowClosed;
  }
}

export function transformConnectionToEdge(connection: Connection): Edge {
  // Use stored handles - both source and target are fixed as chosen by user
  // If not stored, use defaults
  const sourceHandle = connection.sourceHandle || "bottom";
  const targetHandle = connection.targetHandle || "top";

  return {
    id: connection.id,
    source: connection.sourceId,
    target: connection.targetId,
    sourceHandle,
    targetHandle,
    type: "smoothstep", // Use smoothstep for smooth rounded corners
    animated: false,
    style: {
      stroke: connection.style.color,
      strokeWidth: connection.style.strokeWidth,
    },
    markerEnd: {
      type: mapArrowTypeToMarkerType(connection.style.arrowType),
      color: connection.style.color,
    },
    label: connection.label,
  };
}

export function transformConnectionsToEdges(connections: Connection[]): Edge[] {
  return connections.map((connection) => {
    return transformConnectionToEdge(connection);
  });
}
