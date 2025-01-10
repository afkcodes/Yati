import type React from 'react';
import {createContext, useCallback, useContext, useState} from 'react';
import type {Theme} from '~types/common.types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  const setTheme = useCallback((newTheme: Theme) => {
    setCurrentTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{theme: currentTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return {theme: context.theme, setTheme: context.setTheme};
};
