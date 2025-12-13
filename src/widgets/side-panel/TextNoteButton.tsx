interface TextNoteButtonProps {
  onClick?: () => void;
}

export function TextNoteButton({ onClick }: TextNoteButtonProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/text-note", "true");
    // Create a custom drag image
    const dragImage = document.createElement("div");
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.padding = "var(--spacing-sm) var(--spacing-md)";
    dragImage.style.backgroundColor = "var(--color-background)";
    dragImage.style.color = "var(--color-text-primary)";
    dragImage.style.border = "2px solid var(--color-border)";
    dragImage.style.borderRadius = "var(--radius-md)";
    dragImage.style.fontSize = "var(--font-size-sm)";
    dragImage.textContent = "📝 Текстовая заметка";
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
        marginTop: "var(--spacing-lg)",
        marginBottom: "var(--spacing-sm)",
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-primary)",
        border: "2px solid var(--color-border)",
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
        e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        e.currentTarget.style.cursor = "grab";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-surface)";
        e.currentTarget.style.cursor = "grab";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = "grab";
      }}
    >
      <span style={{ fontSize: "1.2em" }}>📝</span>
      <span>Текстовая заметка</span>
    </button>
  );
}

