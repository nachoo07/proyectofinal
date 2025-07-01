// src/components/ThemeToggle.jsx
import { Button } from '@mui/material';
import { useSettings } from '../../context/settings/settingsContext';

function ThemeToggle() {
  const { themeMode, toggleTheme } = useSettings();

  return (
    <Button onClick={toggleTheme} variant="contained">
      Cambiar a {themeMode === 'light' ? 'Dark' : 'Light'} Mode
    </Button>
  );
}

export default ThemeToggle;