import { useRef, useState } from "react";
import { useDiagram } from "@/app/providers/DiagramProvider";
import { saveDiagram } from "@/features/save-load/saveDiagram";
import { exportDiagramToFile } from "@/features/save-load/exportDiagram";
import { importDiagramFromFile, validateDiagramFile } from "@/features/save-load/importDiagram";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";
import { HelpButton } from "@/widgets/help-modal/HelpModal";

export function Toolbar() {
  const { diagram, dispatch } = useDiagram();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDiagram(diagram);
      console.log("Diagram saved successfully");
    } catch (error) {
      console.error("Failed to save diagram:", error);
      alert(`Failed to save diagram: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
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

    setIsImporting(true);
    try {
      const importedDiagram = await importDiagramFromFile(file);
      dispatch({
        type: "LOAD_DIAGRAM",
        diagram: importedDiagram,
      });
      console.log("Diagram imported successfully");
    } catch (error) {
      console.error("Failed to import diagram:", error);
      alert(
        `Failed to import diagram: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsImporting(false);
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
        disabled={isSaving}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: isSaving ? "var(--color-secondary)" : "var(--color-primary)",
          color: "var(--color-text-inverse)",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: isSaving ? "not-allowed" : "pointer",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          transition: "var(--transition-base)",
          opacity: isSaving ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isSaving) {
            e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSaving) {
            e.currentTarget.style.backgroundColor = "var(--color-primary)";
          }
        }}
        title="Save diagram to browser storage (Ctrl+S)"
        aria-label="Сохранить схему"
        aria-busy={isSaving}
      >
        {isSaving ? "⏳ Сохранение..." : "💾 Сохранить"}
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
        aria-label="Экспортировать схему в JSON файл"
      >
        📤 Экспорт
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        disabled={isImporting}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          cursor: isImporting ? "not-allowed" : "pointer",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          transition: "var(--transition-base)",
          opacity: isImporting ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isImporting) {
            e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isImporting) {
            e.currentTarget.style.backgroundColor = "var(--color-surface)";
          }
        }}
        title="Import diagram from JSON file"
        aria-label="Импортировать схему из JSON файла"
        aria-busy={isImporting}
      >
        {isImporting ? "⏳ Импорт..." : "📥 Импорт"}
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
