import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { type Task } from './TaskCard';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  groups: string[];
  users: string[];
  tags: string[];
  priorities: string[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  groups,
  users,
  tags,
  priorities
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
    due: '',
    tags: [] as string[],
    subtasks: [] as { id: string; text: string; completed: boolean }[],
    notes: '',
    status: 'Todo'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedTo: task.assignedTo,
        due: task.due ? task.due.toISOString().split('T')[0] : '',
        tags: task.tags,
        subtasks: task.subtasks,
        notes: task.notes,
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        assignedTo: '',
        due: '',
        tags: [],
        subtasks: [],
        notes: '',
        status: 'Todo'
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData: Partial<Task> = {
      ...formData,
      due: formData.due ? new Date(formData.due) : undefined,
      id: task?.id || crypto.randomUUID(),
      created: task?.created || new Date()
    };

    onSave(taskData);
    onClose();
  };

  const addSubtask = () => {
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: crypto.randomUUID(), text: '', completed: false }]
    }));
  };

  const updateSubtask = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => st.id === id ? { ...st, text } : st)
    }));
  };

  const toggleSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
    }));
  };

  const removeSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigned To
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due}
                onChange={(e) => setFormData(prev => ({ ...prev, due: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Subtasks
              </label>
              <button
                type="button"
                onClick={addSubtask}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={subtask.text}
                    onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                    placeholder="Subtask description"
                    className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;