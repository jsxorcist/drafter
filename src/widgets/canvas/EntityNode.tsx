import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { EntityType } from "@/entities/diagram/types";
import { ENTITY_TYPE_ICONS } from "@/entities/diagram/constants";

interface EntityNodeData {
  label: string;
  entityType: string;
  style: {
    color: string;
    shape: "rectangle" | "circle" | "diamond" | "ellipse";
    width?: number;
    height?: number;
  };
  onLabelUpdate?: (newLabel: string) => void;
}

function EntityNodeComponent({ data }: NodeProps<EntityNodeData>) {
  const { label, style, onLabelUpdate, entityType } = data;
  const { color, shape, width = 150, height = 60 } = style;
  const type = entityType as EntityType;
  const icon = ENTITY_TYPE_ICONS[type] || "🔷";
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get unique border styles based on entity type
  const getBorderStyle = (): React.CSSProperties => {
    switch (type) {
      case "process":
        return { border: `3px solid ${color}` };
      case "component":
        return { border: `3px dashed ${color}` };
      case "actor":
        return { border: `4px double ${color}` };
      case "decision":
        return { border: `3px solid ${color}` };
      case "data":
        return { border: `3px dotted ${color}` };
      case "custom":
        return { border: `2px solid ${color}` };
      default:
        return { border: `3px solid ${color}` };
    }
  };

  const shapeStyles: Record<string, React.CSSProperties> = {
    rectangle: {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: type === "component" ? "var(--radius-lg)" : "var(--radius-md)",
    },
    circle: {
      width: `${Math.max(width, height)}px`,
      height: `${Math.max(width, height)}px`,
      borderRadius: "50%",
    },
    diamond: {
      width: `${width}px`,
      height: `${height}px`,
      transform: "rotate(45deg)",
      borderRadius: "var(--radius-sm)",
    },
    ellipse: {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: "50%",
    },
  };

  const nodeStyle: React.CSSProperties = {
    ...shapeStyles[shape],
    ...getBorderStyle(),
    backgroundColor: color,
    color: "var(--color-text-inverse)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--spacing-sm)",
    boxShadow: isEditing
      ? "var(--shadow-lg)"
      : type === "decision"
      ? "var(--shadow-xl)"
      : "var(--shadow-md)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    textAlign: "center",
    wordWrap: "break-word",
    overflow: "hidden",
    transition: "var(--transition-base)",
    cursor: isEditing ? "text" : "move",
    position: "relative",
  };

  const labelStyle: React.CSSProperties =
    shape === "diamond"
      ? {
          transform: "rotate(-45deg)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : {};

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(label);
  };

  const handleBlur = () => {
    if (editValue.trim() !== label && onLabelUpdate) {
      onLabelUpdate(editValue.trim() || label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editValue.trim() !== label && onLabelUpdate) {
        onLabelUpdate(editValue.trim() || label);
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} />
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            ...labelStyle,
            background: "rgba(255, 255, 255, 0.2)",
            border: "2px solid var(--color-text-inverse)",
            borderRadius: "var(--radius-sm)",
            padding: "var(--spacing-xs)",
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            textAlign: "center",
            width: "90%",
            outline: "none",
            transition: "var(--transition-fast)",
          }}
        />
      ) : (
        <div
          style={{
            ...labelStyle,
            cursor: "text",
            userSelect: "none",
            display: "flex",
            flexDirection: shape === "diamond" ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            gap: shape === "diamond" ? "var(--spacing-xs)" : "var(--spacing-xs)",
            width: "100%",
            flexWrap: shape === "diamond" ? "wrap" : "nowrap",
          }}
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          <span style={{ fontSize: "1.5em", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
          <span style={{ fontSize: "0.9em", textAlign: "center" }}>{label}</span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const EntityNode = memo(EntityNodeComponent);

