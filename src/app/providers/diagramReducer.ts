import { Diagram, Entity, Connection, TextNote, Stroke } from "@/entities/diagram/types";
import { generateId } from "@/shared/lib/id-generator";

export type DiagramAction =
  | { type: "CREATE_ENTITY"; entity: Entity }
  | { type: "DELETE_ENTITY"; entityId: string }
  | { type: "UPDATE_ENTITY_POSITION"; entityId: string; position: { x: number; y: number } }
  | { type: "UPDATE_ENTITY_LABEL"; entityId: string; label: string }
  | { type: "CREATE_CONNECTION"; connection: Connection }
  | { type: "DELETE_CONNECTION"; connectionId: string }
  | { type: "CREATE_TEXT_NOTE"; note: TextNote }
  | { type: "DELETE_TEXT_NOTE"; noteId: string }
  | { type: "UPDATE_TEXT_NOTE"; noteId: string; text: string }
  | { type: "UPDATE_TEXT_NOTE_POSITION"; noteId: string; position: { x: number; y: number } }
  | { type: "ADD_DRAWING_STROKE"; drawingId: string; stroke: Stroke }
  | { type: "DELETE_DRAWING"; drawingId: string }
  | { type: "LOAD_DIAGRAM"; diagram: Diagram }
  | { type: "RESET_DIAGRAM" }
  | { type: "UNDO" }
  | { type: "REDO" };

export function diagramReducer(state: Diagram, action: DiagramAction): Diagram {
  const now = new Date().toISOString();

  switch (action.type) {
    case "CREATE_ENTITY": {
      return {
        ...state,
        entities: [...state.entities, action.entity],
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "DELETE_ENTITY": {
      return {
        ...state,
        entities: state.entities.filter((e) => e.id !== action.entityId),
        connections: state.connections.filter(
          (c) => c.sourceId !== action.entityId && c.targetId !== action.entityId
        ),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "UPDATE_ENTITY_POSITION": {
      return {
        ...state,
        entities: state.entities.map((e) =>
          e.id === action.entityId ? { ...e, position: action.position } : e
        ),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "UPDATE_ENTITY_LABEL": {
      return {
        ...state,
        entities: state.entities.map((e) =>
          e.id === action.entityId ? { ...e, label: action.label } : e
        ),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "CREATE_CONNECTION": {
      return {
        ...state,
        connections: [...state.connections, action.connection],
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "DELETE_CONNECTION": {
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.connectionId),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "CREATE_TEXT_NOTE": {
      return {
        ...state,
        textNotes: [...state.textNotes, action.note],
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "DELETE_TEXT_NOTE": {
      return {
        ...state,
        textNotes: state.textNotes.filter((n) => n.id !== action.noteId),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "UPDATE_TEXT_NOTE": {
      return {
        ...state,
        textNotes: state.textNotes.map((n) =>
          n.id === action.noteId ? { ...n, text: action.text } : n
        ),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "UPDATE_TEXT_NOTE_POSITION": {
      return {
        ...state,
        textNotes: state.textNotes.map((n) =>
          n.id === action.noteId ? { ...n, position: action.position } : n
        ),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "ADD_DRAWING_STROKE": {
      // Check if drawing exists
      const drawingExists = state.drawings.some((d) => d.id === action.drawingId);
      
      if (!drawingExists && action.stroke.points.length > 0) {
        // Create new drawing if it doesn't exist and stroke has points
        const newDrawing = {
          id: action.drawingId,
          strokes: [action.stroke],
          style: {
            color: action.stroke.color || "#000000",
            strokeWidth: action.stroke.strokeWidth || 2,
          },
        };
        return {
          ...state,
          drawings: [...state.drawings, newDrawing],
          metadata: { ...state.metadata, updatedAt: now },
        };
      }

      // Add stroke to existing drawing (only if stroke has points)
      if (action.stroke.points.length > 0) {
        return {
          ...state,
          drawings: state.drawings.map((d) =>
            d.id === action.drawingId
              ? { ...d, strokes: [...d.strokes, action.stroke] }
              : d
          ),
          metadata: { ...state.metadata, updatedAt: now },
        };
      }

      // If stroke is empty, don't update
      return state;
    }

    case "DELETE_DRAWING": {
      return {
        ...state,
        drawings: state.drawings.filter((d) => d.id !== action.drawingId),
        metadata: { ...state.metadata, updatedAt: now },
      };
    }

    case "LOAD_DIAGRAM": {
      return action.diagram;
    }

    case "RESET_DIAGRAM": {
      return {
        id: generateId(),
        version: "1.0.0",
        entities: [],
        connections: [],
        textNotes: [],
        drawings: [],
        metadata: {
          createdAt: now,
          updatedAt: now,
        },
      };
    }

    case "UNDO":
    case "REDO": {
      // These are handled by the provider, should not reach here
      return state;
    }

    default: {
      return state;
    }
  }
}

