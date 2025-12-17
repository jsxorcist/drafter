// Core entity types for the diagram builder

export interface Position {
  x: number;
  y: number;
}

export type EntityType = "process" | "component" | "actor" | "decision" | "data" | "custom";

export interface EntityStyle {
  color: string;
  shape: "rectangle" | "circle" | "diamond" | "ellipse";
  width?: number;
  height?: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  label: string;
  style: EntityStyle;
}

export interface ConnectionStyle {
  color: string;
  strokeWidth: number;
  arrowType: "default" | "arrowclosed" | "arrowclosedsmall";
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  style: ConnectionStyle;
}

export interface TextNoteStyle {
  fontSize: number;
  color: string;
  backgroundColor?: string;
  borderRadius: number;
}

export interface TextNote {
  id: string;
  position: Position;
  text: string;
  style: TextNoteStyle;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  strokeWidth: number;
}

export interface DrawingStyle {
  color: string;
  strokeWidth: number;
}

export interface Drawing {
  id: string;
  strokes: Stroke[];
  style: DrawingStyle;
}

export interface DiagramMetadata {
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface Diagram {
  id: string;
  version: string;
  entities: Entity[];
  connections: Connection[];
  textNotes: TextNote[];
  drawings: Drawing[];
  metadata: DiagramMetadata;
}
