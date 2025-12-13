import { Diagram } from "@/entities/diagram/types";

/**
 * History manager for undo/redo functionality
 * Uses state snapshots for simplicity
 */
export class HistoryManager {
  private history: Diagram[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  /**
   * Add a new state to history
   */
  push(state: Diagram): void {
    // Remove any states after current index (when undoing and then doing new action)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(JSON.parse(JSON.stringify(state))); // Deep clone
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  /**
   * Get previous state (undo)
   */
  undo(): Diagram | null {
    if (!this.canUndo()) {
      return null;
    }

    this.currentIndex--;
    return JSON.parse(JSON.stringify(this.history[this.currentIndex])); // Deep clone
  }

  /**
   * Get next state (redo)
   */
  redo(): Diagram | null {
    if (!this.canRedo()) {
      return null;
    }

    this.currentIndex++;
    return JSON.parse(JSON.stringify(this.history[this.currentIndex])); // Deep clone
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Initialize with initial state
   */
  initialize(initialState: Diagram): void {
    this.history = [JSON.parse(JSON.stringify(initialState))];
    this.currentIndex = 0;
  }
}

