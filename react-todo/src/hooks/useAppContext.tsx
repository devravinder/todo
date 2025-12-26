/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { defaultConfig } from "../util/constants";

type AppContextType = {
  config: TodoConfig;
  setConfig: (config: TodoConfig)=>void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TodoConfig>(defaultConfig);

  return (
    <AppContext.Provider value={{ config, setConfig }}>
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