import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard, { type Task } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  onNewTask,
  onEditTask,
  onDeleteTask,
  onDrop,
  onDragOver,
  onDragStart
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onNewTask}
          className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div
        className="flex-1 p-4 space-y-3 overflow-y-auto min-h-0"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task)}
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No tasks yet</p>
            <button
              onClick={onNewTask}
              className="text-blue-600 hover:text-blue-700 text-sm mt-1"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;