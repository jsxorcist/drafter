import { Diagram } from "@/entities/diagram/types";

const AUTOSAVE_DELAY = 1000; // 1 second delay
let autoSaveTimeout: number | null = null;

export function autoSave(diagram: Diagram): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(() => {
    try {
      const json = JSON.stringify(diagram);
      localStorage.setItem(`diagram-${diagram.id}`, json);
      console.log("Auto-saved diagram");
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, AUTOSAVE_DELAY);
}

export function cancelAutoSave(): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
}
