import { createContext, useContext, useReducer, ReactNode } from "react";
import { Diagram } from "@/entities/diagram/types";
import { diagramReducer, DiagramAction } from "./diagramReducer";
import { createEmptyDiagram } from "@/entities/diagram/factory";

interface DiagramContextType {
  diagram: Diagram;
  dispatch: React.Dispatch<DiagramAction>;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

interface DiagramProviderProps {
  children: ReactNode;
}

export function DiagramProvider({ children }: DiagramProviderProps) {
  const [diagram, dispatch] = useReducer(diagramReducer, createEmptyDiagram());

  return (
    <DiagramContext.Provider value={{ diagram, dispatch }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error("useDiagram must be used within DiagramProvider");
  }
  return context;
}

