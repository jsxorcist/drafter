import { Node } from "reactflow";
import { Entity } from "@/entities/diagram/types";

export function transformEntityToNode(entity: Entity): Node {
  return {
    id: entity.id,
    position: entity.position,
    data: {
      label: entity.label,
      entityType: entity.type,
      style: entity.style,
    },
    type: "entity",
  };
}

export function transformEntitiesToNodes(entities: Entity[]): Node[] {
  return entities.map(transformEntityToNode);
}

