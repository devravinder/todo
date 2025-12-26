import React, { useEffect, useState } from "react";
import { ADD, CLOSE, DELETE } from "../util/icons";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;

  task: Task;
  statuses: string[];
  users: string[];
  tags: string[];
  priorities: string[];
}

const COMPLETED_TASK_PREFIX = "[x] ";
const IN_COMPLETED_TASK_PREFIX = "[ ] ";
const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDeleteTask,
  task,
  statuses,
  users,
  tags,
  priorities,
}) => {
  const [formData, setFormData] = useState<Task>(task);
  const [subTasks, setSubTasks] = useState<
    { text: string; completed: boolean }[]
  >([]);
  const [newSubTask, setNewSubTask] = useState("");

  const handleClose = () => {
    setNewSubTask("");
    onClose();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Title.trim()) return;

    const taskData:Task = {
      ...formData,
      completedDate: task?.createdDate || new Date(),
      Subtasks: subTasks.map(task=> task.completed ? `${COMPLETED_TASK_PREFIX}${task.text}` : `${IN_COMPLETED_TASK_PREFIX}${task.text}`)
    };

    onSave(taskData);
    handleClose();
  };

  const addSubtask = () => {
    if (!newSubTask.trim()) return;
    setSubTasks((prev) => [...prev, { text: newSubTask, completed: false }]);
    setNewSubTask("");
  };

  const updateSubtask = (index: number, text: string) => {
    setSubTasks((pre) =>
      pre.map((st, i) => (i === index ? { ...st, text } : st))
    );
  };

  const toggleSubtask = (index: number) => {
    setSubTasks((pre) =>
      pre.map((st, i) =>
        i === index ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const removeSubtask = (index: number) => {
    setSubTasks((pre) => pre.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      Tags: prev.Tags.includes(tag)
        ? prev.Tags.filter((t) => t !== tag)
        : [...prev.Tags, tag],
    }));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(task);
    setSubTasks(task.Subtasks?.map(e=>{
      if(e.includes(COMPLETED_TASK_PREFIX))
      return ({text: e.replace(COMPLETED_TASK_PREFIX,""), completed: true})
    else return ({text: e.replace(IN_COMPLETED_TASK_PREFIX,""), completed: false})
    }) || [])
    
  }, [task]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {task.Id ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.Title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.Description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  Description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={formData.Priority}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Priority: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigned To
              </label>
              <select
                value={formData.AssignedTo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    AssignedTo: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={
                  (formData.dueDate || new Date())?.toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: e.target.valueAsDate || new Date(),
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.Status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.Tags.includes(tag)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                      : "bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-2 items-start justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Subtasks
              </label>
              <div className="space-y-2 w-full">
                {subTasks.map((subtask, index) => (
                  <div
                    key={`subtask.${index}`}
                    className="w-full flex flex-row items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(index)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={subtask.text}
                      onChange={(e) => updateSubtask(index, e.target.value)}
                      placeholder="Subtask description"
                      className="grow px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => removeSubtask(index)}>
                      {DELETE}
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-row items-center space-x-2">
                <div className="w-3"></div>
                <input
                  type="text"
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  placeholder="Add Subtask..."
                  className="grow px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button type="button" onClick={() => addSubtask()}>
                  {ADD}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.Notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Notes: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex flex-row  gap-4 justify-between">
            <div className="">
              {task.Id && (
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.Id!)}
                  className="px-4 py-2  text-slate-700 bg-red-300 rounded-lg hover:bg-red-400 "
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            <div className="flex flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {task.Id ? "Update" : "Create"} Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
