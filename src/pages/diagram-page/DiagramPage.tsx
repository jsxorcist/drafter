import { useState } from "react";
import { EntityType } from "@/entities/diagram/types";
import { SidePanel } from "@/widgets/side-panel/SidePanel";
import { Canvas } from "@/widgets/canvas/Canvas";

export function DiagramPage() {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | null>(null);

  const handleEntityTypeSelect = (type: EntityType) => {
    setSelectedEntityType(type);
  };

  const handleEntityCreated = () => {
    // Reset selection after entity is created for better UX
    // User can click again to create another entity of the same type
    // Or this can be removed if we want to keep selection active
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SidePanel
        selectedEntityType={selectedEntityType}
        onEntityTypeSelect={handleEntityTypeSelect}
      />
      <Canvas selectedEntityType={selectedEntityType} onEntityCreated={handleEntityCreated} />
    </div>
  );
}

