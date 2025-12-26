import React, { useState } from "react";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "./TaskModal";
import SettingsModal from "./SettingsModal";
import { config } from "../util/constants";

const newTask = (status?: string): Task => {
  return {
    Title: "",
    Status: status || config["Workflow Statuses"]["CREATE_STATUS"],
    Description: "",
    Notes: "",
    Priority: config.Priorities[config.Priorities.length-1],
    createdDate: new Date(),
    dueDate: new Date(),
    Tags: [],
    Subtasks: [],
  };
};
const sampleTasks: Task[] = [
  {
    Id: "001",
    Title: "Setup Project Repository",
    Description: "Initialize Git repository and base project structure.",
    Priority: config.Priorities[0],
    AssignedTo: config.Users[0],
    createdDate: new Date("2025-01-10"),
    startedDate: new Date("2025-01-10"),
    dueDate: new Date("2025-01-12"),
    completedDate: new Date("2025-01-12"),
    Tags: config.Tags.slice(0, 2),
    Subtasks: [
      "[x] Create GitHub repo",
      "[x] Add README.md",
    ],
    Notes: "Initial setup completed successfully.",
    Status: config.Statuses[3],
  },

  {
    Id: "002",
    Title: "Design Application Layout",
    Description: "Create layout wireframes and UI structure.",
    Priority: config.Priorities[1],
    AssignedTo: config.Users[1],
    createdDate: new Date("2025-01-11"),
    startedDate: new Date("2025-01-12"),
    dueDate: new Date("2025-01-15"),
    completedDate: undefined,
    Tags: [config.Tags[2], config.Tags[1]],
    Subtasks: [
      "[x] Create wireframes",
      "[ ] Approve layout",
    ],
    Notes: "Waiting for feedback.",
    Status: config.Statuses[1],
  },

  {
    Id: "003",
    Title: "Implement Task Model",
    Description: "Create task schema and validation logic.",
    Priority: config.Priorities[2],
    AssignedTo: config.Users[0],
    createdDate: new Date("2025-01-12"),
    startedDate: new Date("2025-01-12"),
    dueDate: new Date("2025-01-14"),
    completedDate: undefined,
    Tags: [config.Tags[3], config.Tags[1]],
    Subtasks: [
      "[x] Define interface",
      "[ ] Add validation",
    ],
    Notes: "Schema almost done.",
    Status: config.Statuses[1],
  },

  {
    Id: "004",
    Title: "Create Task List UI",
    Description: "Render task list with statuses.",
    Priority: config.Priorities[1],
    AssignedTo: config.Users[0],
    createdDate: new Date("2025-01-13"),
    startedDate: undefined,
    dueDate: new Date("2025-01-16"),
    completedDate: undefined,
    Tags: [config.Tags[2], config.Tags[1]],
    Subtasks: [
      "[ ] Create list component",
      "[ ] Map tasks",
    ],
    Notes: "Blocked by API readiness.",
    Status: config.Statuses[0],
  },

  {
    Id: "005",
    Title: "Add Drag and Drop",
    Description: "Enable moving tasks between statuses.",
    Priority: config.Priorities[1],
    AssignedTo: config.Users[2],
    createdDate: new Date("2025-01-13"),
    startedDate: undefined,
    dueDate: new Date("2025-01-17"),
    completedDate: undefined,
    Tags: [config.Tags[1], config.Tags[2]],
    Subtasks: [
      "[ ] Implement drag logic",
      "[ ] Persist order",
    ],
    Notes: "",
    Status: config.Statuses[0],
  },

  {
    Id: "006",
    Title: "Backend API Integration",
    Description: "Connect frontend with backend APIs.",
    Priority: config.Priorities[1],
    AssignedTo: config.Users[0],
    createdDate: new Date("2025-01-14"),
    startedDate: new Date("2025-01-15"),
    dueDate: new Date("2025-01-18"),
    completedDate: undefined,
    Tags: [config.Tags[3]],
    Subtasks: [
      "[x] Fetch tasks API",
      "[ ] Save updates",
    ],
    Notes: "Auth pending.",
    Status: config.Statuses[1],
  },

  {
    Id: "007",
    Title: "Add Priority Colors",
    Description: "Apply color coding based on priority.",
    Priority: config.Priorities[3],
    AssignedTo: config.Users[1],
    createdDate: new Date("2025-01-15"),
    startedDate: new Date("2025-01-15"),
    dueDate: new Date("2025-01-16"),
    completedDate: new Date("2025-01-16"),
    Tags: [config.Tags[2], config.Tags[5]],
    Subtasks: [
      "[x] Map priority colors",
      "[x] Test UI",
    ],
    Notes: "Looks good.",
    Status: config.Statuses[3],
  },

  {
    Id: "008",
    Title: "Write Unit Tests",
    Description: "Add tests for task logic.",
    Priority: config.Priorities[2],
    AssignedTo: config.Users[0],
    createdDate: new Date("2025-01-16"),
    startedDate: undefined,
    dueDate: new Date("2025-01-19"),
    completedDate: undefined,
    Tags: [config.Tags[7]],
    Subtasks: [
      "[ ] Test create task",
      "[ ] Test status change",
    ],
    Notes: "",
    Status: config.Statuses[0],
  },

  {
    Id: "009",
    Title: "Documentation Update",
    Description: "Update README with usage instructions.",
    Priority: config.Priorities[3],
    AssignedTo: config.Users[2],
    createdDate: new Date("2025-01-17"),
    startedDate: new Date("2025-01-17"),
    dueDate: new Date("2025-01-18"),
    completedDate: undefined,
    Tags: [config.Tags[6]],
    Subtasks: [
      "[x] Update setup steps",
      "[ ] Add screenshots",
    ],
    Notes: "",
    Status: config.Statuses[2],
  },

  {
    Id: "010",
    Title: "Archive Old Tasks",
    Description: "Move completed tasks to archive.",
    Priority: config.Priorities[3],
    AssignedTo: config.Users[1],
    createdDate: new Date("2025-01-18"),
    startedDate: new Date("2025-01-18"),
    dueDate: new Date("2025-01-18"),
    completedDate: new Date("2025-01-18"),
    Tags: [config.Tags[5]],
    Subtasks: [
      "[x] Filter completed tasks",
      "[x] Move to archive",
    ],
    Notes: "Cleanup done.",
    Status: config.Statuses[4],
  },
];

export default function KanbanDashboard() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks || []);
  const [statuses, setStatuses] = useState(config.Statuses);
  const [users, setUsers] = useState(config.Users);
  const [tags, setTags] = useState(config.Tags);
  const [priorities, setPriorities] = useState(config.Priorities);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task>(() => newTask());

  const handleNewTask = (status: string) => {
    setEditingTask(newTask(status));
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Task) => {
    if (taskData.Id) {
      setTasks((pre) =>
        pre.map((task) =>
          task.Id === taskData.Id ? ({ ...task, ...taskData } as Task) : task
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        { ...taskData, Id: `000${tasks.length + 1}`.slice(-3) },
      ]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.Id !== taskId));
    setIsTaskModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("text/plain", task.Id!);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");

    setTasks((prev) =>
      prev.map((task) => {
        if (task.Id === taskId) {
          const updatedTask:Task = { ...task, Status: targetStatus };

          // Update timestamps based on status
          if (targetStatus === config["Workflow Statuses"]["START_STATUS"] && !task.startedDate) {
            updatedTask.startedDate = new Date();
          } else if (targetStatus === config["Workflow Statuses"]["END_STATUS"] && !task.completedDate) {
            updatedTask.completedDate = new Date();
          }

          return updatedTask;
        }
        return task;
      })
    );
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.Status === status);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col gap-4">
      <Header
        onNewTask={() => handleNewTask(config.Statuses[0])}
        onSettings={() => setIsSettingsModalOpen(true)}
      />

      <main className="flex gap-4 overflow-x-auto p-8">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            title={status}
            tasks={getTasksByStatus(status)}
            onNewTask={() => handleNewTask(status)}
            onEditTask={handleEditTask}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
          />
        ))}
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(newTask());
        }}
        onDeleteTask={handleDeleteTask}
        onSave={handleSaveTask}
        task={editingTask}
        statuses={statuses}
        users={users}
        tags={tags}
        priorities={priorities}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        groups={statuses}
        users={users}
        tags={tags}
        priorities={priorities}
        onUpdateGroups={setStatuses}
        onUpdateUsers={setUsers}
        onUpdateTags={setTags}
        onUpdatePriorities={setPriorities}
      />
    </div>
  );
}
