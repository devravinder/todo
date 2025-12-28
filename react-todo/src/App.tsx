import KanbanDashboard from "./components/KanbanDashboard";
import { AppContextProvider } from "./hooks/useAppContext";

export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white backdrop-blur">
        <AppContextProvider>
          <KanbanDashboard />
        </AppContextProvider>
    </div>
  );
}