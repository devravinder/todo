import { CLOSE } from "../../util/icons";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ isOpen, onClose }: ProjectModalProps) => {
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Project List</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
