import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Entity } from "@/entities/diagram/types";

interface EntityNodeData {
  label: string;
  entityType: string;
  style: {
    color: string;
    shape: "rectangle" | "circle" | "diamond" | "ellipse";
    width?: number;
    height?: number;
  };
}

function EntityNodeComponent({ data }: NodeProps<EntityNodeData>) {
  const { label, style } = data;
  const { color, shape, width = 150, height = 60 } = style;

  const shapeStyles: Record<string, React.CSSProperties> = {
    rectangle: {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: "var(--radius-md)",
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
    backgroundColor: color,
    color: "var(--color-text-inverse)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--spacing-sm)",
    boxShadow: "var(--shadow-md)",
    border: `2px solid ${color}`,
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    textAlign: "center",
    wordWrap: "break-word",
    overflow: "hidden",
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

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} />
      <div style={labelStyle}>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const EntityNode = memo(EntityNodeComponent);

