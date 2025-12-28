/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { syncWithStore } from "../util/syncStore";

type ActiveModal = "TASK" | "ARCHIVE" | "SETTINGS" | undefined;

type AppContextType = {
  config: TodoConfig;
  onConfigChange: (value: TodoConfig, sideEffects: Change[]) => void;
  activeModal: ActiveModal;
  setActiveModal: (activeModal: ActiveModal) => void;
  tasks: Task[];
  statuses: string[];
  addTask: (task: Task) => void;
  editTask: (id: string, task: Task) => void;
  deleteTask: (taskId: string) => void;
  changeStatus: (id: string, status: string) => void;
  getSampleNewTask: (status?: string) => Task;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const SideEffectKey: Partial<{
  [K in keyof TodoConfig]: keyof Task | undefined;
}> = {
  Categories: "Category",
  Priorities: "Priority",
  Statuses: "Status",
  Users: "AssignedTo",
};

export const AppContextProvider = ({ children, defaultConfig, defaultTasks }: { children: ReactNode,defaultConfig: TodoConfig, defaultTasks: Task[]  }) => {
  const [config, setConfig] = useState<TodoConfig>(defaultConfig);
  const [activeModal, setActiveModal] = useState<ActiveModal>();
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const getSampleNewTask = (status?: string): Task => {
    return {
      Title: "",
      Status: status || config["Workflow Statuses"]["CREATE_STATUS"],
      Description: "",
      Notes: "",
      Priority: config.Priorities[config.Priorities.length - 1],
      createdDate: new Date(),
      dueDate: new Date(),
      Tags: [],
      Subtasks: [],
    };
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        Id: `000${tasks.length + 1}`.slice(-3),
        createdDate: new Date(),
      },
    ]);
  };

  const editTask = (id: string, task: Partial<Task>) => {
    const old = tasks.find((task) => task.Id === id);

    if (old) {
      const { Status: targetStatus } = task;
      const { Status: currentStatus } = old;

      // Update timestamps based on status
      if (targetStatus !== currentStatus) {
        switch (targetStatus) {
          case config["Workflow Statuses"]["START_STATUS"]: {
            task.startedDate = new Date();
            break;
          }

          case config["Workflow Statuses"]["END_STATUS"]: {
            task.completedDate = new Date();
            break;
          }
        }
      }

      setTasks((pre) =>
        pre.map((old) => (id === old.Id ? { ...old, ...task } : old))
      );
    }
  };

  const changeStatus = (id: string, status: string) => {
    editTask(id, { Status: status });
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.Id !== taskId));
  };

  const updateTaskField = (
    key: keyof Task,
    from: Task[keyof Task],
    to: Task[keyof Task]
  ) => {
    setTasks((pre) =>
      pre.map((old) => (old[key] === from ? { ...old, [key]: to } : old))
    );
  };

  const handleSideEffects = (sideEffects: Change[]) => {
    for (const { key, oldValue, newValue, type } of sideEffects) {
      if (key in SideEffectKey && type === "UPDATE") {
        updateTaskField(
          SideEffectKey[key as keyof TodoConfig]!,
          oldValue as string,
          newValue as string
        );
        // for DELETE, we don't delete tasks
      }
    }
  };

  const onConfigChange = (value: TodoConfig, sideEffects: Change[]) => {
    handleSideEffects(sideEffects);
    setConfig(value);
  };

  const statuses = useMemo(
    () =>
      config.Statuses.filter(
        (s) => s != config["Workflow Statuses"].ARCHIVE_STATUS
      ),
    [config]
  );

  useEffect(() => {
    syncWithStore(tasks, config);
  }, [tasks, config]);

  return (
    <AppContext.Provider
      value={{
        config,
        activeModal,
        tasks,
        statuses,
        onConfigChange,
        setActiveModal,
        addTask,
        editTask,
        deleteTask,
        changeStatus,
        getSampleNewTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useName must be used within a NameProvider");
  }

  return context;
};

export default useAppContext;
