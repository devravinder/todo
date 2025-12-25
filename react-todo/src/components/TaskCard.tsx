import React from 'react';
import { Calendar, User, Tag, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  created: Date;
  started?: Date;
  due?: Date;
  completed?: Date;
  tags: string[];
  subtasks: { id: string; text: string; completed: boolean }[];
  notes: string;
  status: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDragging }) => {
  const priorityColors = {
    Low: '🟢',
    Medium: '🟡',
    High: '🔴'
  };

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-slate-800 text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs">{priorityColors[task.priority]}</span>
        {task.assignedTo && (
          <div className="flex items-center text-xs text-slate-600">
            <User className="w-3 h-3 mr-1" />
            @{task.assignedTo}
          </div>
        )}
      </div>

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded"
            >
              <Tag className="w-2 h-2 mr-1" />
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-slate-500">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {format(task.created, 'dd-MMM-yyyy')}
        </div>
        {task.due && (
          <div className="flex items-center text-orange-600">
            Due: {format(task.due, 'dd-MMM')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;