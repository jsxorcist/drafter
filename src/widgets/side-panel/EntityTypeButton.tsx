import { EntityType } from "@/entities/diagram/types";
import { ENTITY_TYPE_LABELS, ENTITY_TYPE_ICONS, DEFAULT_ENTITY_COLORS } from "@/entities/diagram/constants";

interface EntityTypeButtonProps {
  type: EntityType;
  isSelected: boolean;
  onClick: () => void;
}

export function EntityTypeButton({ type, isSelected, onClick }: EntityTypeButtonProps) {
  const label = ENTITY_TYPE_LABELS[type];
  const icon = ENTITY_TYPE_ICONS[type];
  const color = DEFAULT_ENTITY_COLORS[type];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "var(--spacing-md)",
        marginBottom: "var(--spacing-sm)",
        backgroundColor: isSelected ? color : "var(--color-surface)",
        color: isSelected ? "var(--color-text-inverse)" : "var(--color-text-primary)",
        border: `2px solid ${isSelected ? color : "var(--color-border)"}`,
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
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }
      }}
    >
      <span style={{ fontSize: "1.2em" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

