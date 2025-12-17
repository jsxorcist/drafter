interface DrawingModeButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export function DrawingModeButton({ isActive, onToggle }: DrawingModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        padding: "var(--spacing-md)",
        marginTop: "var(--spacing-sm)",
        marginBottom: "var(--spacing-sm)",
        backgroundColor: isActive ? "var(--color-primary)" : "var(--color-surface)",
        color: isActive ? "var(--color-text-inverse)" : "var(--color-text-primary)",
        border: `2px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
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
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }
      }}
    >
      <span style={{ fontSize: "1.2em" }}>✏️</span>
      <span>{isActive ? "Режим рисования (активен)" : "Режим рисования"}</span>
    </button>
  );
}
