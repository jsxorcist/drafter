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
  return {
    id: connection.id,
    source: connection.sourceId,
    target: connection.targetId,
    type: "default",
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
  return connections.map(transformConnectionToEdge);
}
