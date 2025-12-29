/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import Welcome from "../components/Welcome";
import type { AppData } from "../util/converter";
import {
  readFromStore,
  writeToStore,
  type FileReadResult,
} from "../util/syncStore";
import { useIndexedDB } from "./useIndexDB";
import { useSessionId } from "./useSessionId";

type ProjectContextType = {
  activeProject: Project;
  appData: AppData;
  updateProjectData: (
    project: Project,
    tasks: Task[],
    config: TodoConfig
  ) => Promise<void>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export type Project = {
  id: string;
  name: string;
  fileHandle: FileSystemFileHandle;
  lastAccessed: number;
  env: "CLOUD" | "LOCAL";
  type: FileFormat;
};

const DB_NAME = "todo-db";
const STORE_INSTANCE_NAME = "projects";
const ID_KEY_NAME = "id";

export type FileError = "AbortError" | "NotFoundError" | "BrowserNotSupports";

export const ProjectContextProvider = ({
  children,
  dbName = DB_NAME,
  storeName = STORE_INSTANCE_NAME,
  keyPath = ID_KEY_NAME,
}: {
  children: ReactNode;
  dbName?: string;
  storeName?: string;
  keyPath?: string;
}) => {
  const [activeProject, setActiveProject] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [appData, setAppData] = useState<AppData>();
  const [fileError, setFileError] = useState<FileError>();

  const sessionId = useSessionId();

  const db = useIndexedDB<Project>({
    name: dbName,
    version: 1,
    stores: [
      {
        name: storeName,
        keyPath,
      },
    ],
  });

  const addProject = async (data: Project) => db.put(storeName, data);

  const getProjects = async () => db.getAll(storeName);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getProject = async (id: string) => db.get(storeName, id);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteProject = async (id: string) => db.remove(storeName, id);

  const updateProject = async (project: Project) => db.put(storeName, project);

  const updateProjectData = async (
    project: Project,
    tasks: Task[],
    config: TodoConfig
  ) => {
    await writeToStore(tasks, config, project.fileHandle, project.type);
  };

  const readProjectData = async (project: Project): Promise<FileReadResult> => {
    const data = await readFromStore(project.fileHandle, project.type);
    return data;
  };

  const onNewProjectSelect = async (fileHandle: FileSystemFileHandle) => {
    const project: Project = {
      id: sessionId,
      name: fileHandle.name,
      type: fileHandle.name.includes(".md") ? "md" : "json",
      fileHandle,
      env: "LOCAL",
      lastAccessed: new Date().getTime(),
    };
    await addProject(project);
    setActiveProject(project);
  };

  useEffect(() => {
    const syncState = async (project: Project) => {
      setLoading(true);
      const result = await readProjectData(project);
      if ("data" in result) setAppData(result.data);
      else {
        setFileError(result.message);
        if (result.message === "NotFoundError"){
          await deleteProject(project.id);
        }
      }
      setLoading(false);
    };
    if (activeProject) syncState(activeProject);
  }, [activeProject]);

  useLayoutEffect(() => {
    const getLatestProject = async () => {
      const projects = await getProjects();
      if (projects.length) {
        const lastAccessed = projects.sort(
          (f, s) => f.lastAccessed - s.lastAccessed
        )[0];
        setActiveProject(lastAccessed);

        await updateProject({
          ...lastAccessed,
          lastAccessed: new Date().getTime(),
        });
      }
    };

    getLatestProject();
  }, []);

  if (!activeProject || loading || fileError || !appData)
    return (
      <Welcome
        fileError={fileError}
        onGetStarted={(fileHandleResult) => {
          setFileError(undefined);
          if ("handle" in fileHandleResult)
            onNewProjectSelect(fileHandleResult.handle);
          else setFileError(fileHandleResult.message);
        }}
      />
    );

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        updateProjectData,
        appData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectContextProvider");
  }

  return context;
}

export const WithActiveProjectData = ({
  children,
}: {
  children: (data: AppData) => React.ReactNode;
}) => {
  const { appData } = useProject();

  return children(appData);
};
