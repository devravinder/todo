import KanbanDashboard from "./components/KanbanDashboard";
import { AppContextProvider } from "./hooks/useAppContext";
import {
  ProjectContextProvider,
  WithActiveProjectTasks,
} from "./hooks/useProject";

export default function App() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white backdrop-blur">
      <ProjectContextProvider>
        <WithActiveProjectTasks>
          {({ tasks, config }) => (
            <AppContextProvider defauleTasks={tasks} defaultConfig={config}>
              <KanbanDashboard />
            </AppContextProvider>
          )}
        </WithActiveProjectTasks>
      </ProjectContextProvider>
    </div>
  );
}
