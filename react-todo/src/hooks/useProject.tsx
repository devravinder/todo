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
import { defaultConfig } from "../util/constants";
import type { AppData } from "../util/converter";
import { readFromStore, writeToStore } from "../util/syncStore";
import { useIndexedDB } from "./useIndexDB";
import { useSessionId } from "./useSessionId";

type ProjectContextType = {
  activeProject: Project;
  addProject: (data: Project) => Promise<IDBValidKey>;
  getProjects: () => Promise<Project[]>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (project: Project) => Promise<IDBValidKey>;
  getProject: (id: string) => Promise<Project | undefined>;
  updateProjectData: (tasks: Task[], config: TodoConfig) => Promise<void>;
  readProjectData: (project?: Project) => Promise<AppData>;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export type Project = {
  id: string;
  name: string;
  fileHandle: FileSystemFileHandle;
  lastAccessed: number;
  env: "CLOUD" | "LOCAL";
  type: FileFormat | "INDEX_DB";
};

const DB_NAME = "todo-db";
const STORE_INSTANCE_NAME = "projects";
const ID_KEY_NAME = "id";
// const COLLECTION_NAME="Projects"

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

  const getProject = async (id: string) => db.get(storeName, id);

  const deleteProject = async (id: string) => db.remove(storeName, id);

  const updateProject = async (project: Project) => db.put(storeName, project);

  const updateProjectData = async(tasks: Task[], config: TodoConfig) => {
    if (activeProject && activeProject.type !== "INDEX_DB")
      await writeToStore(tasks, config, activeProject.fileHandle, activeProject.type);
  };

  const createAndSetActiveProject = async (
    fileHandle: FileSystemFileHandle
  ) => {
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

    await writeToStore(
      [],
      defaultConfig,
      fileHandle,
      project.type as FileFormat
    );
  };

  const readProjectData = async (project?: Project): Promise<AppData> => {
    if (project && project.type !== "INDEX_DB") {
      const data = await readFromStore(project.fileHandle, project.type);
      return data;
    }
    return { tasks: [], config: defaultConfig };
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeProject)
    return (
      <Welcome
        onGetStarted={(fileHandleResult) => {
          if ("handle" in fileHandleResult)
            createAndSetActiveProject(fileHandleResult.handle);
          else window.alert(fileHandleResult.message);
        }}
      />
    );

  return (
    <ProjectContext.Provider
      value={{
        activeProject,
        addProject,
        getProjects,
        getProject,
        deleteProject,
        updateProject,
        updateProjectData,
        readProjectData,
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

export const WithActiveProjectTasks = ({
  children,
}: {
  children: (data: AppData) => React.ReactNode;
}) => {
  const { activeProject, readProjectData } = useProject();
  const [appData, setAppData] = useState<AppData>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncState = async () => {
      setLoading(true);
      const data = await readProjectData(activeProject);
      setAppData(data);
      setLoading(false);
    };

    syncState();
  }, [activeProject, readProjectData]);

  if (loading || !appData) return <div className="">Loading</div>;

  return children(appData);
};
