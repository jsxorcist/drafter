import { Diagram } from "@/entities/diagram/types";
import { saveDiagram } from "./saveDiagram";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 1000; // 1 second

/**
 * Auto-save diagram with debounce
 */
export function autoSaveDiagram(diagram: Diagram): void {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    try {
      saveDiagram(diagram);
    } catch (error) {
      // Silently fail for auto-save to avoid interrupting user
      console.error("Auto-save failed:", error);
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}

/**
 * Cancel pending auto-save
 */
export function cancelAutoSave(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

