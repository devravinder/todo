import React from "react";
import { format } from "date-fns";
import { CALENDER, CLOCK, EDIT, USER } from "../util/icons";
 
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, isDragging }) => {
  const completedSubtasks = task.Subtasks.filter((st) => st.includes("[x] ")).length;
  const totalSubtasks = task.Subtasks.length;

  return (
    <div
      className={`flex flex-col gap-6 bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <span className="text-xs text-slate-500 line-clamp-1">#{task.Id}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="cursor-pointer text-xs"
          >
            {EDIT}
          </button>
        </div>
        <h3 className="font-medium text-slate-800 text-md leading-tight line-clamp-1 flex-1">
          {task.Title}
        </h3>
      </div>

      {task.Description && (
        <p className="text-sm text-slate-500 line-clamp-3">
          {task.Description}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1">
          <span className="text-xs py-1 px-2 rounded-md bg-emerald-100 ">
            {task.Priority}
          </span>
          {task.AssignedTo && (
            <span className="text-xs py-1 px-2 rounded-md bg-purple-200  text-purple-600">
              {USER}@{task.AssignedTo}
            </span>
          )}
          {task.Category && (
            <span className="text-xs py-1 px-2 rounded-md bg-sky-200  text-sky-600">
              {task.Category}
            </span>
          )}
          {task.Tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
            >
              {tag}
            </span>
          ))}
          {task.Tags.length > 3 && (
            <span className="text-xs text-slate-500">
              +{task.Tags.length - 3}
            </span>
          )}
        </div>

        {totalSubtasks > 0 && (
          <div className="flex flex-row items-center gap-2">
            <div className="flex-1 bg-slate-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{
                  width: `${
                    totalSubtasks > 0
                      ? (completedSubtasks / totalSubtasks) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
              <span className="text-xs text-slate-600">
                {completedSubtasks}/{totalSubtasks}
              </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            {CALENDER} {format(task.createdDate, "dd-MMM-yyyy")}
          </div>
          {task.dueDate && (
            <div className="flex items-center text-orange-600">
              {CLOCK} {format(task.dueDate, "dd-MMM-yyyy")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
