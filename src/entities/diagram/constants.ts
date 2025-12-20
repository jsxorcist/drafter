import { EntityType } from "./types";

export const ENTITY_TYPES: EntityType[] = [
  "process",
  "component",
  "actor",
  "decision",
  "data",
  "custom",
];

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  process: "Процесс",
  component: "Компонент",
  actor: "Актор",
  decision: "Решение",
  data: "Данные",
  custom: "Пользовательский",
};

export const ENTITY_TYPE_ICONS: Record<EntityType, string> = {
  process: "⚙️",
  component: "📦",
  actor: "👤",
  decision: "❓",
  data: "💾",
  custom: "🔷",
};

export const DEFAULT_ENTITY_COLORS: Record<EntityType, string> = {
  process: "#3b82f6",
  component: "#10b981",
  actor: "#f59e0b",
  decision: "#ef4444",
  data: "#8b5cf6",
  custom: "#6b7280",
};

export const DEFAULT_ENTITY_SHAPES: Record<
  EntityType,
  "rectangle" | "circle" | "diamond" | "ellipse"
> = {
  process: "rectangle",
  component: "rectangle",
  actor: "ellipse",
  decision: "rectangle",
  data: "rectangle",
  custom: "rectangle",
};
