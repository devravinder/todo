import React, { useState } from "react";
import useAppContext from "../hooks/useAppContext";
import ArchiveModel from "./ArchiveModel";
import Header from "./Header";
import KanbanColumn from "./KanbanColumn";
import SettingsModal from "./settings/SettingsModal";
import TaskModal from "./task/TaskModal";

export default function KanbanDashboard() {
  const { activeModal, config, tasks, statuses, changeStatus, setActiveModal } =
    useAppContext();
    
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

  const [editingTask, setEditingTask] = useState<Task>(() => newTask());

  const handleNewTask = (status: string) => {
    setEditingTask(newTask(status));
    setActiveModal("TASK");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setActiveModal("TASK");
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

    changeStatus(taskId, targetStatus);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.Status === status);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Header
        onNewTask={() => handleNewTask(config.Statuses[0])}
        onSettings={() => setActiveModal("SETTINGS")}
        onArchive={() => setActiveModal("ARCHIVE")}
      />
      <div className="max-w-7xl h-full overflow-auto flex flex-col pb-2">
        <div className="w-full grow flex justify-around gap-4 py-8">
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
        </div>

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
          task={editingTask}
        />

        <SettingsModal
          isOpen={activeModal === "SETTINGS"}
          onClose={() => setActiveModal(undefined)}
        />
      </div>
    </div>
  );
}
