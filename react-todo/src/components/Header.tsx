import React from "react";
import { ADD, ARCHIVE, FOLDER, SETTINGS } from "../util/icons";
import { getFileHandler, writeToFile } from "../util/fileHandler";
import useProject from "../hooks/useProject";
import { toStoreData } from "../util/converter";
import useAppContext from "../hooks/useAppContext";
import { toMarkdown } from "../util/markdownParser";

interface HeaderProps {
  onNewTask: () => void;
  onSettings: () => void;
  onArchive: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNewTask,
  onSettings,
  onArchive,
}) => {
  const { addProject, getProjects } = useProject();

  const { tasks, config } = useAppContext();

  return (
    <header className="w-full bg-white border-b shadow border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              <img src="./favicon.png" />
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Task Board</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={async () => {
              const res = await getProjects();

              console.log({ res });

              const handle = res[0].handle;

              const data = toStoreData(tasks, config);

              const content = JSON.stringify(data, null, 2)

              await writeToFile(handle, content);
            }}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {"R"}
          </button>

          <button
            onClick={onNewTask}
            className=" cursor-pointerinline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none transition-colors"
          >
            {ADD} New Task
          </button>
          <button
            onClick={async () => {
              const handle = await getFileHandler("json");

              const res = await addProject({
                name: handle?.name || crypto.randomUUID(),
                handle,
                lastAccessed: new Date().getTime(),
              });

              console.log({ res });
            }}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {FOLDER}
          </button>
          <button
            onClick={onArchive}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {ARCHIVE}
          </button>
          <button
            onClick={onSettings}
            className=" cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 "
          >
            {SETTINGS}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
