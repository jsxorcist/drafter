import { Diagram } from "@/entities/diagram/types";
import { deserializeDiagram, getStorageKey } from "@/entities/diagram/serialization";

const STORAGE_KEY = getStorageKey();

/**
 * Load diagram from LocalStorage
 * Returns a promise to support async operations and loading states
 */
export function loadDiagram(): Promise<Diagram | null> {
  return new Promise((resolve, reject) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Simulate async operation for better UX (loading states)
        setTimeout(() => {
          resolve(null);
        }, 100);
        return;
      }

      const diagram = deserializeDiagram(saved);
      // Simulate async operation for better UX (loading states)
      setTimeout(() => {
        resolve(diagram);
      }, 100);
    } catch (error) {
      if (error instanceof Error) {
        reject(new Error(`Failed to load diagram from LocalStorage: ${error.message}`));
      } else {
        reject(new Error("Failed to load diagram from LocalStorage: unknown error"));
      }
    }
  });
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
