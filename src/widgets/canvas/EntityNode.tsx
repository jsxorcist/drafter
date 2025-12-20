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
  const [isHovered, setIsHovered] = useState(false);
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

  // Outer wrapper to allow handles to extend beyond node boundaries
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    overflow: "visible",
    width: "100%",
    height: "100%",
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
    <div
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Handles on all sides for flexible connection points - visible only on hover */}
      {/* Each position has both source and target handles to allow connections in both directions */}
      {/* Top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      {/* Right */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      {/* Bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          bottom: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          bottom: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      {/* Left */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          border: "2px solid var(--color-background)",
          borderRadius: "50%",
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
          position: "absolute",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: isHovered ? "auto" : "none",
        }}
      />
    <div style={nodeStyle}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label="Редактирование названия сущности"
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
          aria-label={`Сущность: ${label}. Двойной клик для редактирования.`}
          role="button"
          tabIndex={0}
        >
          <span style={{ fontSize: "1.5em", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
          <span style={{ fontSize: "0.9em", textAlign: "center" }}>{label}</span>
        </div>
      )}
      </div>
    </div>
  );
}

export const EntityNode = memo(EntityNodeComponent);
