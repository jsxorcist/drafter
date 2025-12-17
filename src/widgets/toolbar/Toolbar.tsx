import { useRef } from "react";
import { useDiagram } from "@/app/providers/DiagramProvider";
import { saveDiagram } from "@/features/save-load/saveDiagram";
import { exportDiagramToFile } from "@/features/save-load/exportDiagram";
import { importDiagramFromFile, validateDiagramFile } from "@/features/save-load/importDiagram";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";
import { HelpButton } from "@/widgets/help-modal/HelpModal";

export function Toolbar() {
  const { diagram, dispatch } = useDiagram();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    try {
      saveDiagram(diagram);
      // Visual feedback could be added here (toast notification, etc.)
      console.log("Diagram saved successfully");
    } catch (error) {
      console.error("Failed to save diagram:", error);
      alert(`Failed to save diagram: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleExport = () => {
    try {
      exportDiagramToFile(diagram);
    } catch (error) {
      console.error("Failed to export diagram:", error);
      alert(
        `Failed to export diagram: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateDiagramFile(file);
    if (!validation.valid) {
      alert(validation.error || "Invalid file");
      return;
    }

    try {
      const importedDiagram = await importDiagramFromFile(file);
      dispatch({
        type: "LOAD_DIAGRAM",
        diagram: importedDiagram,
      });
      // Visual feedback could be added here
      console.log("Diagram imported successfully");
    } catch (error) {
      console.error("Failed to import diagram:", error);
      alert(
        `Failed to import diagram: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "var(--spacing-md)",
        right: "var(--spacing-md)",
        display: "flex",
        gap: "var(--spacing-sm)",
        zIndex: 1000,
        backgroundColor: "var(--color-background)",
        padding: "var(--spacing-sm)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <button
        type="button"
        onClick={handleSave}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--color-primary)",
          color: "var(--color-text-inverse)",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          transition: "var(--transition-base)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
        }}
        title="Save diagram to browser storage (Ctrl+S)"
      >
        💾 Сохранить
      </button>
      <button
        type="button"
        onClick={handleExport}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          transition: "var(--transition-base)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }}
        title="Export diagram to JSON file"
      >
        📤 Экспорт
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          transition: "var(--transition-base)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }}
        title="Import diagram from JSON file"
      >
        📥 Импорт
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <ThemeToggle />
      <HelpButton />
    </div>
  );
}
