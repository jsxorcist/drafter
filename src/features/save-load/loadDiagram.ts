import { Diagram } from "@/entities/diagram/types";
import { deserializeDiagram, getStorageKey } from "@/entities/diagram/serialization";

const STORAGE_KEY = getStorageKey();

/**
 * Load diagram from LocalStorage
 */
export function loadDiagram(): Diagram | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    return deserializeDiagram(saved);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load diagram from LocalStorage: ${error.message}`);
    }
    throw new Error("Failed to load diagram from LocalStorage: unknown error");
  }
}

/**
 * Clear saved diagram from LocalStorage
 */
export function clearSavedDiagram(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to clear saved diagram: ${error.message}`);
    }
    throw new Error("Failed to clear saved diagram: unknown error");
  }
}
