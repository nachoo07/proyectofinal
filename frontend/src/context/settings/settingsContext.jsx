import { createContext, useContext, useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // 1. Corregir inicialización y guardado automático
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState(16); // 2. Usar número en vez de string
useEffect(() => {
  if (themeMode) {
    localStorage.setItem('themeMode', themeMode);
    document.body.setAttribute('data-bs-theme', themeMode);
  }
}, [themeMode]);
  // Cargar configuración inicial
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    const savedFontSize = localStorage.getItem('fontSize');
    
    setThemeMode(savedMode || (prefersDarkMode ? 'dark' : 'light'));
    setFontSize(savedFontSize ? parseInt(savedFontSize) : 16);
  }, [prefersDarkMode]);

  // 3. Sincronizar con Bootstrap y guardar
  useEffect(() => {
    if (themeMode) {
      localStorage.setItem('themeMode', themeMode);
      document.body.setAttribute('data-bs-theme', themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (fontSize) localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 4. Convertir a rem basado en tamaño numérico
  const getFontSize = (size) => {
    // Tamaño base: 16px = 1rem
    return `${size / 16}rem`; // Ej: 18px → 1.125rem
  };

  return (
    <SettingsContext.Provider
      value={{
        themeMode,
        toggleTheme,
        fontSize,
        setFontSize,
        getFontSize
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}