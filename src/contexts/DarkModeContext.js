import React, { createContext, useContext, useState } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children, initialDarkMode = false }) {
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  // Permet d'ignorer le mode sombre sur certains écrans
  const [ignoreDarkMode, setIgnoreDarkMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ darkMode: ignoreDarkMode ? false : darkMode, setDarkMode, setIgnoreDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
