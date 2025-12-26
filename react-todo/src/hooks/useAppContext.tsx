/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { defaultConfig } from "../util/constants";

type ActiveModal = "TASK" | "ARCHIVE" | "SETTINGS" | undefined
type AppContextType = {
  config: TodoConfig;
  setConfig: (config: TodoConfig)=>void;
  activeModal: ActiveModal
  setActiveModal:(activeModal: ActiveModal)=>void
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TodoConfig>(defaultConfig);
  const [activeModal, setActiveModal] = useState<ActiveModal>()

  return (
    <AppContext.Provider value={{ config, setConfig, activeModal, setActiveModal }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useName must be used within a NameProvider");
  }

  return context;
};

export default useAppContext;