import { createContext, useContext, useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'normal';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const getFontSize = (size) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'normal':
        return '1rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  };

  return (
    <SettingsContext.Provider value={{ themeMode, toggleTheme, fontSize, setFontSize, getFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}