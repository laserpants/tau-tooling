import React, { useState, createContext } from "react";

export const AppContext = createContext({});

export function AppContextProvider({ children }) {
  const [bundle, setBundle] = useState();

  const appContext = {
    bundle,
    setBundle,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
}
