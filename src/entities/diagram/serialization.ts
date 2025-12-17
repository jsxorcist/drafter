import { Diagram } from "./types";

export interface SerializedDiagram {
  version: string;
  diagram: Diagram;
}

const CURRENT_VERSION = "1.0.0";
const STORAGE_KEY = "drafter-diagram";

/**
 * Serialize diagram to JSON string
 */
export function serializeDiagram(diagram: Diagram): string {
  const serialized: SerializedDiagram = {
    version: CURRENT_VERSION,
    diagram,
  };
  return JSON.stringify(serialized, null, 2);
}

/**
 * Deserialize diagram from JSON string with validation
 */
export function deserializeDiagram(json: string): Diagram {
  try {
    const parsed = JSON.parse(json) as unknown;

    // Validate basic structure
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid diagram format: not an object");
    }

    // Handle both old format (direct Diagram) and new format (SerializedDiagram)
    let diagramData: unknown;
    if ("diagram" in parsed && "version" in parsed) {
      // New format with versioning
      const serialized = parsed as SerializedDiagram;
      diagramData = serialized.diagram;

      // Version compatibility check
      if (serialized.version !== CURRENT_VERSION) {
        console.warn(
          `Diagram version mismatch: expected ${CURRENT_VERSION}, got ${serialized.version}. Attempting to load anyway.`
        );
      }
    } else {
      // Old format (direct Diagram) - for backward compatibility
      diagramData = parsed;
    }

    // Validate diagram structure
    if (!diagramData || typeof diagramData !== "object") {
      throw new Error("Invalid diagram format: diagram data is not an object");
    }

    const diagram = diagramData as Diagram;

    // Validate required fields
    if (!diagram.id || typeof diagram.id !== "string") {
      throw new Error("Invalid diagram: missing or invalid id");
    }

    if (!diagram.version || typeof diagram.version !== "string") {
      throw new Error("Invalid diagram: missing or invalid version");
    }

    if (!diagram.metadata || typeof diagram.metadata !== "object") {
      throw new Error("Invalid diagram: missing or invalid metadata");
    }

    if (!Array.isArray(diagram.entities)) {
      throw new Error("Invalid diagram: entities must be an array");
    }

    if (!Array.isArray(diagram.connections)) {
      throw new Error("Invalid diagram: connections must be an array");
    }

    if (!Array.isArray(diagram.textNotes)) {
      throw new Error("Invalid diagram: textNotes must be an array");
    }

    if (!Array.isArray(diagram.drawings)) {
      throw new Error("Invalid diagram: drawings must be an array");
    }

    // Ensure metadata has required fields
    if (!diagram.metadata.createdAt || !diagram.metadata.updatedAt) {
      const now = new Date().toISOString();
      diagram.metadata = {
        ...diagram.metadata,
        createdAt: diagram.metadata.createdAt || now,
        updatedAt: diagram.metadata.updatedAt || now,
      };
    }

    return diagram;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to deserialize diagram: ${error.message}`);
    }
    throw new Error("Failed to deserialize diagram: unknown error");
  }
}

/**
 * Get current diagram version
 */
export function getCurrentDiagramVersion(): string {
  return CURRENT_VERSION;
}

/**
 * Get storage key for LocalStorage
 */
export function getStorageKey(): string {
  return STORAGE_KEY;
}
