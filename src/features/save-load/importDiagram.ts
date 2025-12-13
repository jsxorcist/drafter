import { Diagram } from "@/entities/diagram/types";
import { deserializeDiagram } from "@/entities/diagram/serialization";

/**
 * Import diagram from JSON file
 */
export function importDiagramFromFile(file: File): Promise<Diagram> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== "string") {
          reject(new Error("Failed to read file: invalid file content"));
          return;
        }

        const diagram = deserializeDiagram(text);
        resolve(diagram);
      } catch (error) {
        if (error instanceof Error) {
          reject(new Error(`Failed to import diagram: ${error.message}`));
        } else {
          reject(new Error("Failed to import diagram: unknown error"));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate diagram file before import
 */
export function validateDiagramFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.name.endsWith(".json") && file.type !== "application/json") {
    return {
      valid: false,
      error: "File must be a JSON file",
    };
  }

  // Check file size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 10MB limit",
    };
  }

  return { valid: true };
}

