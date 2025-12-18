import { useEffect, useState } from "react";
import { DiagramProvider, useDiagram } from "./providers/DiagramProvider";
import { DiagramPage } from "@/pages/diagram-page/DiagramPage";
import { loadDiagram } from "@/features/save-load/loadDiagram";
import { hasSavedDiagram } from "@/features/save-load/saveDiagram";

function AppContent() {
  const { dispatch } = useDiagram();
  const [hasCheckedSaved, setHasCheckedSaved] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!hasCheckedSaved) {
      const loadSavedDiagram = async () => {
        try {
          if (hasSavedDiagram()) {
            const shouldRestore = window.confirm(
              "Обнаружена сохраненная схема. Хотите восстановить ее?"
            );
            if (shouldRestore) {
              try {
                const savedDiagram = await loadDiagram();
                if (savedDiagram) {
                  dispatch({
                    type: "LOAD_DIAGRAM",
                    diagram: savedDiagram,
                  });
                }
              } catch (error) {
                console.error("Failed to restore diagram:", error);
                alert(
                  `Не удалось восстановить схему: ${error instanceof Error ? error.message : "Unknown error"}`
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in AppContent:", error);
          setError(error instanceof Error ? error : new Error("Unknown error"));
        } finally {
          setHasCheckedSaved(true);
        }
      };
      loadSavedDiagram();
    }
  }, [hasCheckedSaved, dispatch]);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Ошибка загрузки приложения</h1>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Попробовать снова</button>
      </div>
    );
  }

  return <DiagramPage />;
}

function App() {
  return (
    <DiagramProvider>
      <AppContent />
    </DiagramProvider>
  );
}

export default App;
