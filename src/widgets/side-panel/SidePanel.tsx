import { ENTITY_TYPES } from "@/entities/diagram/constants";
import { EntityTypeButton } from "./EntityTypeButton";
import { TextNoteButton } from "./TextNoteButton";
import { DrawingModeButton } from "./DrawingModeButton";

interface SidePanelProps {
  isDrawingMode?: boolean;
  onDrawingModeToggle?: () => void;
  onDeleteAllDrawings?: () => void;
  drawingsCount?: number;
}

export function SidePanel({
  isDrawingMode = false,
  onDrawingModeToggle,
  onDeleteAllDrawings,
  drawingsCount = 0,
}: SidePanelProps) {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        padding: "var(--spacing-lg)",
        overflowY: "auto",
        boxShadow: "var(--shadow-sm)",
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
          <EntityTypeButton
            key={type}
            type={type}
            isSelected={false}
            onClick={() => {}}
          />
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
              >
                Удалить все рисунки ({drawingsCount})
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

