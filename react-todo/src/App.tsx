import KanbanDashboard from "./components/KanbanDashboard";
import { AppContextProvider } from "./hooks/useAppContext";

export default function App() {
  return (
    <>
      <AppContextProvider>
        <KanbanDashboard />
      </AppContextProvider>
    </>
  );
}
