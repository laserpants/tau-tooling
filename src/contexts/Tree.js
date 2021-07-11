import React, { useState, createContext } from "react";

export const TreeContext = createContext({});

export function TreeContextProvider({ children }) {
  const [map, setMap] = useState();

  const toggle = (path) => {
    setMap({
      ...map,
      [path]: !map[path],
    });
  };

  const setAll = (val) => {
    let newMap = {};
    Object.keys(map).forEach((key) => { newMap[key] = val });
    setMap(newMap);
  };

  const treeContext = {
    map,
    initialize: setMap,
    toggle,
    expandAll: () => setAll(true),
    collapseAll: () => setAll(false),
  };

  return (
    <TreeContext.Provider value={treeContext}>{children}</TreeContext.Provider>
  );
}
