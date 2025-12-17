import { Diagram } from "@/entities/diagram/types";
import { serializeDiagram, getStorageKey } from "@/entities/diagram/serialization";

const STORAGE_KEY = getStorageKey();

/**
 * Save diagram to LocalStorage
 */
export function saveDiagram(diagram: Diagram): void {
  try {
    const serialized = serializeDiagram(diagram);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save diagram to LocalStorage: ${error.message}`);
    }
    throw new Error("Failed to save diagram to LocalStorage: unknown error");
  }
}

/**
 * Check if diagram exists in LocalStorage
 */
export function hasSavedDiagram(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null && saved.length > 0;
  } catch {
    return false;
  }
}
