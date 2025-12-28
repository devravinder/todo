import KanbanDashboard from "./components/KanbanDashboard";
import { AppContextProvider } from "./hooks/useAppContext";
import { toAppData, type StoreData } from "./util/converter";
import data from "./sample-files/todo.json";
import { ProjectContextProvider } from "./hooks/useProject";

const { config, tasks } = toAppData(data as unknown as StoreData);
export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white backdrop-blur">
      <ProjectContextProvider>
        <AppContextProvider defaultConfig={config} defaultTasks={tasks}>
          <KanbanDashboard />
        </AppContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
