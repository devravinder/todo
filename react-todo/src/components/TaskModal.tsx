import { CLOSE } from "../util/icons";
import TaskForm, { toData, toFormData } from "./TaskForm";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task;
}

const TaskModal = ({
  isOpen,
  onClose,
  onSave,
  onDeleteTask,
  task,
}: TaskModalProps) => {
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = (taskData: Task) => {
    onSave(taskData);
    handleClose();
  };

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

        <TaskForm
          onCancel={handleClose}
          onDelete={() => onDeleteTask(task.Id!)}
          data={toFormData(task)}
          onSubmit={(data) => handleSubmit(toData(data))}
        />
      </div>
    </div>
  );
};

export default TaskModal;
