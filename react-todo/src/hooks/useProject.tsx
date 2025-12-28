/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    type ReactNode
} from "react";
import { useIndexedDB } from "./useIndexDB";

type ProjectContextType = {
  addProject: (data: Project) => Promise<IDBValidKey>
  getProjects: () => Promise<Project[]>
  deleteProject: (id: string) => Promise<void>
  updateProject: (project: Project) => Promise<IDBValidKey>
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

type Project = {
  name: string;
  handle: FileSystemFileHandle;
  lastAccessed: number;
};


const DB_NAME="todo-db"
const STORE_INSTANCE_NAME="settinds"
const ID_KEY_NAME="name"
// const COLLECTION_NAME="Projects"

export const ProjectContextProvider = ({
  children,
  dbName=DB_NAME,
  storeName=STORE_INSTANCE_NAME,
  keyPath=ID_KEY_NAME
}: {
  children: ReactNode;
  dbName?: string;
  storeName?: string,
  keyPath?: string
}) => {
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

  const addProject = async (data:Project) => db.put(storeName, data)

  const getProjects = async()=>db.getAll(storeName);

  const deleteProject = async(id: string)=>db.remove(storeName, id);

  const updateProject = async(project: Project)=> db.put(storeName, project);




  return (
    <ProjectContext.Provider
      value={{
        addProject,
        getProjects,
        deleteProject,
        updateProject
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
