import { EntityType } from "@/entities/diagram/types";
import {
  ENTITY_TYPE_LABELS,
  ENTITY_TYPE_ICONS,
  DEFAULT_ENTITY_COLORS,
} from "@/entities/diagram/constants";

interface EntityTypeButtonProps {
  type: EntityType;
  isSelected: boolean;
  onClick: () => void;
}

export function EntityTypeButton({ type, isSelected, onClick }: EntityTypeButtonProps) {
  const label = ENTITY_TYPE_LABELS[type];
  const icon = ENTITY_TYPE_ICONS[type];
  const color = DEFAULT_ENTITY_COLORS[type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/entity-type", type);
    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.padding = "var(--spacing-sm) var(--spacing-md)";
    dragImage.style.backgroundColor = color;
    dragImage.style.color = "var(--color-text-inverse)";
    dragImage.style.borderRadius = "var(--radius-md)";
    dragImage.style.fontSize = "var(--font-size-sm)";
    dragImage.style.display = "flex";
    dragImage.style.alignItems = "center";
    dragImage.style.gap = "var(--spacing-xs)";
    dragImage.innerHTML = `<span>${icon}</span><span>${label}</span>`;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      style={{
        padding: "var(--spacing-md)",
        marginBottom: "var(--spacing-sm)",
        backgroundColor: isSelected ? color : "var(--color-surface)",
        color: isSelected ? "var(--color-text-inverse)" : "var(--color-text-primary)",
        border: `2px solid ${isSelected ? color : "var(--color-border)"}`,
        borderRadius: "var(--radius-md)",
        cursor: "grab",
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
        e.currentTarget.style.cursor = "grab";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }
        e.currentTarget.style.cursor = "grab";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab";
      }}
      aria-label={`Создать сущность типа ${label}. Перетащите на рабочее поле для размещения.`}
      title={`Перетащите на рабочее поле для создания сущности типа ${label}`}
    >
      <span style={{ fontSize: "1.2em" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
