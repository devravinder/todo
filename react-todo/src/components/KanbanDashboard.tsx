import React, { useState } from "react";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "./TaskModal";
import SettingsModal from "./SettingsModal";
import ArchiveModel from "./ArchiveModel";
import useAppContext from "../hooks/useAppContext";

export default function KanbanDashboard() {
  const {
    activeModal,
    setActiveModal,
    config,
    tasks,
    addTask,
    editTask,
    deleteTask,
  } = useAppContext();

  const newTask = (status?: string): Task => {
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

  const [statuses, setStatuses] = useState(
    config.Statuses.filter(
      (s) => s != config["Workflow Statuses"].ARCHIVE_STATUS
    )
  );
  const [users, setUsers] = useState(config.Users);
  const [tags, setTags] = useState(config.Tags);
  const [priorities, setPriorities] = useState(config.Priorities);

  const [editingTask, setEditingTask] = useState<Task>(() => newTask());

  const handleNewTask = (status: string) => {
    setEditingTask(newTask(status));
    setActiveModal("TASK");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setActiveModal("TASK");
  };

  const handleSaveTask = (task: Task) => {
    if (task.Id) {
      editTask(task.Id, task);
    } else {
      addTask(task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setActiveModal(undefined);
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

    const task = tasks.find((task) => task.Id === taskId);
    if (task) {
      const updatedTask: Task = { ...task, Status: targetStatus };

      // Update timestamps based on status
      if (
        targetStatus === config["Workflow Statuses"]["START_STATUS"] &&
        !task.startedDate
      ) {
        updatedTask.startedDate = new Date();
      } else if (
        targetStatus === config["Workflow Statuses"]["END_STATUS"] &&
        !task.completedDate
      ) {
        updatedTask.completedDate = new Date();
      }

      editTask(taskId, updatedTask)
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.Status === status);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col gap-4">
      <Header
        onNewTask={() => handleNewTask(config.Statuses[0])}
        onSettings={() => setActiveModal("SETTINGS")}
        onArchive={() => setActiveModal("ARCHIVE")}
      />

      <main className="flex justify-center gap-4 overflow-x-auto p-8">
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

      <ArchiveModel
        isOpen={activeModal === "ARCHIVE"}
        onClose={() => setActiveModal(undefined)}
      >
        <KanbanColumn
          title={config["Workflow Statuses"]["ARCHIVE_STATUS"]}
          tasks={getTasksByStatus(
            config["Workflow Statuses"]["ARCHIVE_STATUS"]
          )}
          onNewTask={() =>
            handleNewTask(config["Workflow Statuses"]["ARCHIVE_STATUS"])
          }
          onEditTask={handleEditTask}
          onDrop={(e) =>
            handleDrop(e, config["Workflow Statuses"]["ARCHIVE_STATUS"])
          }
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          allowCreation={false}
        />
      </ArchiveModel>

      <TaskModal
        isOpen={activeModal === "TASK"}
        onClose={() => {
          setActiveModal(undefined);
          setEditingTask(newTask());
        }}
        onDeleteTask={handleDeleteTask}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <SettingsModal
        isOpen={activeModal === "SETTINGS"}
        onClose={() => setActiveModal(undefined)}
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
