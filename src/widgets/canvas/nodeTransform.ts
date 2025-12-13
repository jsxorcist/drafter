import { Node } from "reactflow";
import { Entity, TextNote } from "@/entities/diagram/types";

export function transformEntityToNode(
  entity: Entity,
  onLabelUpdate?: (entityId: string, newLabel: string) => void
): Node {
  return {
    id: entity.id,
    position: entity.position,
    data: {
      label: entity.label,
      entityType: entity.type,
      style: entity.style,
      onLabelUpdate: onLabelUpdate
        ? (newLabel: string) => onLabelUpdate(entity.id, newLabel)
        : undefined,
    },
    type: "entity",
    draggable: true,
  };
}

export function transformEntitiesToNodes(
  entities: Entity[],
  onLabelUpdate?: (entityId: string, newLabel: string) => void
): Node[] {
  return entities.map((entity) => transformEntityToNode(entity, onLabelUpdate));
}

export function transformTextNoteToNode(
  note: TextNote,
  onTextUpdate?: (noteId: string, newText: string) => void
): Node {
  return {
    id: note.id,
    position: note.position,
    data: {
      text: note.text,
      style: note.style,
      onTextUpdate: onTextUpdate
        ? (newText: string) => onTextUpdate(note.id, newText)
        : undefined,
    },
    type: "textNote",
    draggable: true,
  };
}

export function transformTextNotesToNodes(
  notes: TextNote[],
  onTextUpdate?: (noteId: string, newText: string) => void
): Node[] {
  return notes.map((note) => transformTextNoteToNode(note, onTextUpdate));
}

