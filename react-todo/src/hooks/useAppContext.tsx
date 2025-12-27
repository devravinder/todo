/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultConfig } from "../util/constants";

type ActiveModal = "TASK" | "ARCHIVE" | "SETTINGS" | undefined;

type AppContextType = {
  config: TodoConfig;
  onConfigChange: (old: TodoConfig, newValue: TodoConfig) => void;
  activeModal: ActiveModal;
  setActiveModal: (activeModal: ActiveModal) => void;
  tasks: Task[];
  statuses: string[];
  addTask: (task: Task) => void;
  editTask: (id: string, task: Task) => void;
  deleteTask: (taskId: string) => void;
  changeStatus: (id: string, status: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type Change<T> = {
  key: keyof T;
  oldValue: T[keyof T];
  newValue: T[keyof T];
};

type ChangeAction = { key: keyof TodoConfig; from: string; to: string };

const keyMap: Partial<{ [K in keyof TodoConfig]: keyof Task }> = {
  Categories: "Category",
  Priorities: "Priority",
  Statuses: "Status",
  Users: "AssignedTo",
};

const sampleTasks: Task[] = [
  {
    Id: "001",
    Title: "Setup Project Repository",
    Description: "Initialize Git repository and base project structure.",
    Priority: defaultConfig.Priorities[0],
    AssignedTo: defaultConfig.Users[0],
    createdDate: new Date("2025-01-10"),
    startedDate: new Date("2025-01-10"),
    dueDate: new Date("2025-01-12"),
    completedDate: new Date("2025-01-12"),
    Tags: defaultConfig.Tags.slice(0, 2),
    Subtasks: ["[x] Create GitHub repo", "[x] Add README.md"],
    Notes: "Initial setup completed successfully.",
    Status: defaultConfig.Statuses[3],
  },

  {
    Id: "002",
    Title: "Design Application Layout",
    Description: "Create layout wireframes and UI structure.",
    Priority: defaultConfig.Priorities[1],
    AssignedTo: defaultConfig.Users[1],
    createdDate: new Date("2025-01-11"),
    startedDate: new Date("2025-01-12"),
    dueDate: new Date("2025-01-15"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[2], defaultConfig.Tags[1]],
    Subtasks: ["[x] Create wireframes", "[ ] Approve layout"],
    Notes: "Waiting for feedback.",
    Status: defaultConfig.Statuses[1],
  },

  {
    Id: "003",
    Title: "Implement Task Model",
    Description: "Create task schema and validation logic.",
    Priority: defaultConfig.Priorities[2],
    AssignedTo: defaultConfig.Users[0],
    createdDate: new Date("2025-01-12"),
    startedDate: new Date("2025-01-12"),
    dueDate: new Date("2025-01-14"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[3], defaultConfig.Tags[1]],
    Subtasks: ["[x] Define interface", "[ ] Add validation"],
    Notes: "Schema almost done.",
    Status: defaultConfig.Statuses[1],
  },

  {
    Id: "004",
    Title: "Create Task List UI",
    Description: "Render task list with statuses.",
    Priority: defaultConfig.Priorities[1],
    AssignedTo: defaultConfig.Users[0],
    createdDate: new Date("2025-01-13"),
    startedDate: undefined,
    dueDate: new Date("2025-01-16"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[2], defaultConfig.Tags[1]],
    Subtasks: ["[ ] Create list component", "[ ] Map tasks"],
    Notes: "Blocked by API readiness.",
    Status: defaultConfig.Statuses[0],
  },

  {
    Id: "005",
    Title: "Add Drag and Drop",
    Description: "Enable moving tasks between statuses.",
    Priority: defaultConfig.Priorities[1],
    AssignedTo: defaultConfig.Users[2],
    createdDate: new Date("2025-01-13"),
    startedDate: undefined,
    dueDate: new Date("2025-01-17"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[1], defaultConfig.Tags[2]],
    Subtasks: ["[ ] Implement drag logic", "[ ] Persist order"],
    Notes: "",
    Status: defaultConfig.Statuses[0],
  },

  {
    Id: "006",
    Title: "Backend API Integration",
    Description: "Connect frontend with backend APIs.",
    Priority: defaultConfig.Priorities[1],
    AssignedTo: defaultConfig.Users[0],
    createdDate: new Date("2025-01-14"),
    startedDate: new Date("2025-01-15"),
    dueDate: new Date("2025-01-18"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[3]],
    Subtasks: ["[x] Fetch tasks API", "[ ] Save updates"],
    Notes: "Auth pending.",
    Status: defaultConfig.Statuses[1],
  },

  {
    Id: "007",
    Title: "Add Priority Colors",
    Description: "Apply color coding based on priority.",
    Priority: defaultConfig.Priorities[3],
    AssignedTo: defaultConfig.Users[1],
    createdDate: new Date("2025-01-15"),
    startedDate: new Date("2025-01-15"),
    dueDate: new Date("2025-01-16"),
    completedDate: new Date("2025-01-16"),
    Tags: [defaultConfig.Tags[2], defaultConfig.Tags[5]],
    Subtasks: ["[x] Map priority colors", "[x] Test UI"],
    Notes: "Looks good.",
    Status: defaultConfig.Statuses[3],
  },

  {
    Id: "008",
    Title: "Write Unit Tests",
    Description: "Add tests for task logic.",
    Priority: defaultConfig.Priorities[2],
    AssignedTo: defaultConfig.Users[0],
    createdDate: new Date("2025-01-16"),
    startedDate: undefined,
    dueDate: new Date("2025-01-19"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[7]],
    Subtasks: ["[ ] Test create task", "[ ] Test status change"],
    Notes: "",
    Status: defaultConfig.Statuses[0],
  },

  {
    Id: "009",
    Title: "Documentation Update",
    Description: "Update README with usage instructions.",
    Priority: defaultConfig.Priorities[3],
    AssignedTo: defaultConfig.Users[2],
    createdDate: new Date("2025-01-17"),
    startedDate: new Date("2025-01-17"),
    dueDate: new Date("2025-01-18"),
    completedDate: undefined,
    Tags: [defaultConfig.Tags[6]],
    Subtasks: ["[x] Update setup steps", "[ ] Add screenshots"],
    Notes: "",
    Status: defaultConfig.Statuses[2],
  },

  {
    Id: "010",
    Title: "Archive Old Tasks",
    Description: "Move completed tasks to archive.",
    Priority: defaultConfig.Priorities[3],
    AssignedTo: defaultConfig.Users[1],
    createdDate: new Date("2025-01-18"),
    startedDate: new Date("2025-01-18"),
    dueDate: new Date("2025-01-18"),
    completedDate: new Date("2025-01-18"),
    Tags: [defaultConfig.Tags[5]],
    Subtasks: ["[x] Filter completed tasks", "[x] Move to archive"],
    Notes: "Cleanup done.",
    Status: defaultConfig.Statuses[4],
  },
];

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TodoConfig>(defaultConfig);
  const [activeModal, setActiveModal] = useState<ActiveModal>();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

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

  const handleChageActions = (changeActions: ChangeAction[]) => {
    for (const { key, from, to } of changeActions) {
      if (key in keyMap) {
        updateTaskField(keyMap[key]!, from, to);
      }
    }
  };

  const onConfigChange = (oldValue: TodoConfig, newValue: TodoConfig) => {
    const changes: Change<TodoConfig>[] = getChanges<TodoConfig>(
      oldValue,
      newValue
    );
    const changeActions = getChangeActions(changes);
    handleChageActions(changeActions);
    setConfig(newValue);
  };

  const statuses = useMemo(
    () =>
      config.Statuses.filter(
        (s) => s != config["Workflow Statuses"].ARCHIVE_STATUS
      ),
    [config]
  );

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getChanges<T extends Record<string, any>>(oldValue: T, newValue: T) {
  const changes: Change<T>[] = [];

  (Object.keys(oldValue) as (keyof T)[]).forEach((key) => {
    const oldVal = oldValue[key];
    const newVal = newValue[key];

    if (!isEqual(oldVal, newVal)) {
      changes.push({
        key,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  });

  return changes;
}

function getChangeActions(changes: Change<TodoConfig>[]) {
  const changeActions: ChangeAction[] = [];

  for (const { oldValue, newValue, key } of changes) {
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      // in our case only string[]
      const actions: ChangeAction[] = oldValue
        .map((value, index) =>
          value !== newValue[index]
            ? { key, from: value, to: newValue[index] }
            : (undefined as unknown as ChangeAction)
        )
        .filter(Boolean);

      changeActions.push(...actions);
    }
  }

  return changeActions;
}

const isEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useName must be used within a NameProvider");
  }

  return context;
};

export default useAppContext;
