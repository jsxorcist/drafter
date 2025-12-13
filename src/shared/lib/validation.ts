import { Diagram, Entity, Connection } from "@/entities/diagram/types";

export function validateEntity(entity: Entity): boolean {
  if (!entity.id || entity.id.trim() === "") {
    return false;
  }
  if (!entity.label || entity.label.trim() === "") {
    return false;
  }
  if (typeof entity.position.x !== "number" || typeof entity.position.y !== "number") {
    return false;
  }
  return true;
}

export function validateConnection(connection: Connection, diagram: Diagram): boolean {
  if (!connection.id || connection.id.trim() === "") {
    return false;
  }
  if (connection.sourceId === connection.targetId) {
    return false; // No self-connections
  }
  const sourceExists = diagram.entities.some((e) => e.id === connection.sourceId);
  const targetExists = diagram.entities.some((e) => e.id === connection.targetId);
  if (!sourceExists || !targetExists) {
    return false;
  }
  // Check for duplicate connections
  const duplicateExists = diagram.connections.some(
    (c) => c.sourceId === connection.sourceId && c.targetId === connection.targetId
  );
  if (duplicateExists) {
    return false;
  }
  return true;
}

export function canCreateConnection(sourceId: string, targetId: string, diagram: Diagram): boolean {
  if (sourceId === targetId) {
    return false; // No self-connections
  }
  const sourceExists = diagram.entities.some((e) => e.id === sourceId);
  const targetExists = diagram.entities.some((e) => e.id === targetId);
  if (!sourceExists || !targetExists) {
    return false;
  }
  // Check for duplicate connections
  const duplicateExists = diagram.connections.some(
    (c) => c.sourceId === sourceId && c.targetId === targetId
  );
  return !duplicateExists;
}

export function validateDiagram(diagram: Diagram): boolean {
  if (!diagram.id || diagram.id.trim() === "") {
    return false;
  }
  if (!diagram.version || diagram.version.trim() === "") {
    return false;
  }
  // Validate all entities
  for (const entity of diagram.entities) {
    if (!validateEntity(entity)) {
      return false;
    }
  }
  // Validate all connections
  for (const connection of diagram.connections) {
    if (!validateConnection(connection, diagram)) {
      return false;
    }
  }
  return true;
}

