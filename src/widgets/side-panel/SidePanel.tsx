import { useState } from "react";
import { EntityType } from "@/entities/diagram/types";
import { ENTITY_TYPES } from "@/entities/diagram/constants";
import { EntityTypeButton } from "./EntityTypeButton";

interface SidePanelProps {
  selectedEntityType: EntityType | null;
  onEntityTypeSelect: (type: EntityType) => void;
}

export function SidePanel({ selectedEntityType, onEntityTypeSelect }: SidePanelProps) {
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
            isSelected={selectedEntityType === type}
            onClick={() => onEntityTypeSelect(type)}
          />
        ))}
      </div>
      {selectedEntityType && (
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
          Выбран тип: <strong>{ENTITY_TYPES.find((t) => t === selectedEntityType) || ""}</strong>
          <br />
          Кликните на рабочее поле, чтобы разместить сущность
        </div>
      )}
    </div>
  );
}

