import { Diagram } from "@/entities/diagram/types";
import { serializeDiagram } from "@/entities/diagram/serialization";

/**
 * Export diagram to JSON file
 */
export function exportDiagramToFile(diagram: Diagram, filename?: string): void {
  try {
    const serialized = serializeDiagram(diagram);
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      filename || `diagram-${diagram.id}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to export diagram: ${error.message}`);
    }
    throw new Error("Failed to export diagram: unknown error");
  }
}
