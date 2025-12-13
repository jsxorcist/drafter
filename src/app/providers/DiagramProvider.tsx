import { createContext, useContext, useReducer, ReactNode, useRef, useEffect } from "react";
import { Diagram } from "@/entities/diagram/types";
import { diagramReducer, DiagramAction } from "./diagramReducer";
import { createEmptyDiagram } from "@/entities/diagram/factory";
import { HistoryManager } from "@/shared/lib/command";
import { autoSaveDiagram } from "@/features/save-load/autoSave";

interface DiagramContextType {
  diagram: Diagram;
  dispatch: React.Dispatch<DiagramAction>;
  canUndo: boolean;
  canRedo: boolean;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

interface DiagramProviderProps {
  children: ReactNode;
}

export function DiagramProvider({ children }: DiagramProviderProps) {
  const initialDiagram = createEmptyDiagram();
  const [diagram, dispatch] = useReducer(diagramReducer, initialDiagram);
  const historyRef = useRef(new HistoryManager());
  const isUndoRedoRef = useRef(false);

  // Initialize history with initial state
  useEffect(() => {
    historyRef.current.initialize(initialDiagram);
  }, []);

  // Track state changes for history (except undo/redo actions)
  // Position updates are debounced to avoid cluttering history
  const lastHistoryPushRef = useRef<number>(0);
  const lastActionTypeRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!isUndoRedoRef.current) {
      const now = Date.now();
      const timeSinceLastPush = now - lastHistoryPushRef.current;
      const isPositionUpdate = lastActionTypeRef.current === "UPDATE_ENTITY_POSITION";
      
      // For position updates, debounce to avoid cluttering history
      // For other actions, add immediately
      const shouldPush = !isPositionUpdate || timeSinceLastPush > 300;
      
      if (shouldPush) {
        historyRef.current.push(diagram);
        lastHistoryPushRef.current = now;
      }

      // Auto-save diagram (debounced)
      autoSaveDiagram(diagram);
    }
    isUndoRedoRef.current = false;
    lastActionTypeRef.current = null;
  }, [diagram]);

  // Enhanced dispatch that handles undo/redo
  const enhancedDispatch = (action: DiagramAction) => {
    if (action.type === "UNDO") {
      const previousState = historyRef.current.undo();
      if (previousState) {
        isUndoRedoRef.current = true;
        lastActionTypeRef.current = "UNDO";
        dispatch({ type: "LOAD_DIAGRAM", diagram: previousState });
      }
    } else if (action.type === "REDO") {
      const nextState = historyRef.current.redo();
      if (nextState) {
        isUndoRedoRef.current = true;
        lastActionTypeRef.current = "REDO";
        dispatch({ type: "LOAD_DIAGRAM", diagram: nextState });
      }
    } else {
      lastActionTypeRef.current = action.type;
      dispatch(action);
    }
  };

  return (
    <DiagramContext.Provider
      value={{
        diagram,
        dispatch: enhancedDispatch,
        canUndo: historyRef.current.canUndo(),
        canRedo: historyRef.current.canRedo(),
      }}
    >
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

