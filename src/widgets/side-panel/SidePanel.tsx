import { ENTITY_TYPES } from "@/entities/diagram/constants";
import { EntityTypeButton } from "./EntityTypeButton";
import { TextNoteButton } from "./TextNoteButton";
import { DrawingModeButton } from "./DrawingModeButton";

interface SidePanelProps {
  isDrawingMode?: boolean;
  isEraserMode?: boolean;
  onDrawingModeToggle?: () => void;
  onEraserModeToggle?: () => void;
  onDeleteAllDrawings?: () => void;
  drawingsCount?: number;
  strokeWidth?: number;
  onStrokeWidthChange?: (width: number) => void;
}

export function SidePanel({
  isDrawingMode = false,
  isEraserMode = false,
  onDrawingModeToggle,
  onEraserModeToggle,
  onDeleteAllDrawings,
  drawingsCount = 0,
  strokeWidth = 2,
  onStrokeWidthChange,
}: SidePanelProps) {
  return (
    <div
      className="scrollable"
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        padding: "var(--spacing-lg)",
        overflowY: "auto",
        scrollbarGutter: "stable",
        boxShadow: "var(--shadow-sm)",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          fontSize: "var(--font-size-lg)",
          fontWeight: "var(--font-weight-bold)",
          marginBottom: "var(--spacing-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        Создать сущность
      </h2>
      <div>
        {ENTITY_TYPES.map((type) => (
          <EntityTypeButton key={type} type={type} isSelected={false} onClick={() => {}} />
        ))}
      </div>
      <div
        style={{
          marginTop: "var(--spacing-lg)",
          padding: "var(--spacing-md)",
          backgroundColor: "var(--color-background)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-sm)",
            color: "var(--color-text-primary)",
          }}
        >
          Дополнительно
        </h3>
        <TextNoteButton />
        {onDrawingModeToggle && (
          <>
            <DrawingModeButton isActive={isDrawingMode} onToggle={onDrawingModeToggle} />
            {isDrawingMode && (
              <>
                {onEraserModeToggle && (
                  <button
                    type="button"
                    onClick={onEraserModeToggle}
                    style={{
                      padding: "var(--spacing-md)",
                      marginTop: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-sm)",
                      backgroundColor: isEraserMode ? "var(--color-primary)" : "var(--color-surface)",
                      color: isEraserMode ? "var(--color-text-inverse)" : "var(--color-text-primary)",
                      border: `2px solid ${isEraserMode ? "var(--color-primary)" : "var(--color-border)"}`,
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      transition: "var(--transition-base)",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!isEraserMode) {
                        e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isEraserMode) {
                        e.currentTarget.style.backgroundColor = "var(--color-surface)";
                      }
                    }}
                    aria-label={isEraserMode ? "Режим ластика активен. Нажмите для выхода." : "Включить режим ластика"}
                    aria-pressed={isEraserMode}
                  >
                    <span style={{ fontSize: "1.2em" }}>🧹</span>
                    <span>{isEraserMode ? "Режим ластика (активен)" : "Режим ластика"}</span>
                  </button>
                )}
                {onStrokeWidthChange && !isEraserMode && (
                  <div
                    style={{
                      marginTop: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-sm)",
                    }}
                  >
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Размер маркера: {strokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={strokeWidth}
                      onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                      }}
                      aria-label="Размер маркера"
                    />
                  </div>
                )}
              </>
            )}
            {isDrawingMode && drawingsCount > 0 && onDeleteAllDrawings && (
              <button
                type="button"
                onClick={onDeleteAllDrawings}
                style={{
                  padding: "var(--spacing-sm)",
                  marginTop: "var(--spacing-sm)",
                  backgroundColor: "var(--color-error)",
                  color: "var(--color-text-inverse)",
                  border: "2px solid var(--color-error)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  transition: "var(--transition-base)",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-error-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-error)";
                }}
                aria-label="Удалить все рисунки"
              >
                Удалить все рисунки
              </button>
            )}
          </>
        )}
      </div>
      <div
        style={{
          marginTop: "var(--spacing-lg)",
          padding: "var(--spacing-md)",
          backgroundColor: "var(--color-background)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-secondary)",
        }}
      >
        Перетащите элемент на рабочее поле
      </div>
    </div>
  );
}
