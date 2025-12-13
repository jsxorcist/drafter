import { DiagramProvider } from "./providers/DiagramProvider";
import { DiagramPage } from "@/pages/diagram-page/DiagramPage";

function App() {
  return (
    <DiagramProvider>
      <DiagramPage />
    </DiagramProvider>
  );
}

export default App;

