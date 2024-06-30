import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Theme, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import { DarkTheme } from '../themes/Dark';
import { LightTheme } from '../themes/Light';


interface IThemeContextData {
  themeName: 'light' | 'dark';
  theme: Theme;
  toggleTheme: () => void;
}


const ThemeContext = createContext({} as IThemeContextData);

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
};

export const AppThemeProvider = ({ children }: any) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
  }, []);

  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme;

    return DarkTheme;
  }, [themeName]);


  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        <Box width="100vw" height="100vh" bgcolor={theme.palette.background.default}>
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};