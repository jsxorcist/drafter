import { memo, useState, useRef, useEffect } from "react";
import { NodeProps } from "reactflow";

interface TextNoteNodeData {
  text: string;
  style: {
    fontSize: number;
    color: string;
    backgroundColor?: string;
    borderRadius: number;
  };
  onTextUpdate?: (newText: string) => void;
}

function TextNoteNodeComponent({ data }: NodeProps<TextNoteNodeData>) {
  const { text, style, onTextUpdate } = data;
  const { fontSize, color, backgroundColor, borderRadius } = style;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(text);
  };

  const handleBlur = () => {
    if (editValue.trim() !== text && onTextUpdate) {
      onTextUpdate(editValue.trim() || text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (editValue.trim() !== text && onTextUpdate) {
        onTextUpdate(editValue.trim() || text);
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setEditValue(text);
      setIsEditing(false);
    }
  };

  const nodeStyle: React.CSSProperties = {
    minWidth: "200px",
    maxWidth: "300px",
    minHeight: "60px",
    padding: "var(--spacing-sm)",
    backgroundColor: backgroundColor || "var(--color-background)",
    color: color,
    border: `2px solid var(--color-border)`,
    borderRadius: `${borderRadius}px`,
    fontSize: `${fontSize}px`,
    boxShadow: isEditing ? "var(--shadow-lg)" : "var(--shadow-md)",
    transition: "var(--transition-base)",
    cursor: isEditing ? "text" : "move",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={nodeStyle}>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            minHeight: "60px",
            padding: "var(--spacing-xs)",
            background: "transparent",
            border: "2px solid var(--color-primary)",
            borderRadius: "var(--radius-sm)",
            color: color,
            fontSize: `${fontSize}px`,
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
            transition: "var(--transition-fast)",
          }}
          placeholder="Введите текст заметки..."
        />
      ) : (
        <div
          style={{
            cursor: "text",
            userSelect: "none",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflow: "hidden",
          }}
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit (Ctrl+Enter to save)"
        >
          {text || "Пустая заметка"}
        </div>
      )}
    </div>
  );
}

export const TextNoteNode = memo(TextNoteNodeComponent);

