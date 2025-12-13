import { Diagram, DiagramMetadata, Entity, EntityType, Position, Connection, TextNote, Drawing, Stroke, Point } from "./types";
import { generateId } from "@/shared/lib/id-generator";
import { DEFAULT_ENTITY_COLORS, DEFAULT_ENTITY_SHAPES } from "./constants";

export function createEmptyDiagram(): Diagram {
  const now = new Date().toISOString();
  const metadata: DiagramMetadata = {
    createdAt: now,
    updatedAt: now,
  };

  return {
    id: generateId(),
    version: "1.0.0",
    entities: [],
    connections: [],
    textNotes: [],
    drawings: [],
    metadata,
  };
}

export function createEntity(
  type: EntityType,
  position: Position,
  label: string = "Новая сущность"
): Entity {
  return {
    id: generateId(),
    type,
    position,
    label,
    style: {
      color: DEFAULT_ENTITY_COLORS[type],
      shape: DEFAULT_ENTITY_SHAPES[type],
      width: 150,
      height: 60,
    },
  };
}

export function createConnection(
  sourceId: string,
  targetId: string,
  label?: string
): Connection {
  return {
    id: generateId(),
    sourceId,
    targetId,
    label,
    style: {
      color: "#6b7280",
      strokeWidth: 2,
      arrowType: "default",
    },
  };
}

export function createTextNote(
  position: Position,
  text: string = "Новая заметка"
): TextNote {
  return {
    id: generateId(),
    position,
    text,
    style: {
      fontSize: 14,
      color: "var(--color-text-primary)",
      backgroundColor: "var(--color-background)",
      borderRadius: 8,
    },
  };
}

export function createDrawing(): Drawing {
  return {
    id: generateId(),
    strokes: [],
    style: {
      color: "#000000",
      strokeWidth: 2,
    },
  };
}

export function createStroke(
  points: Point[],
  color: string = "#000000",
  strokeWidth: number = 2
): Stroke {
  return {
    points,
    color,
    strokeWidth,
  };
}

