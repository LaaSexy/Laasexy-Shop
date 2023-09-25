import { useState, useEffect } from 'react';

const useThemeDetector = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const mqListener = (e: any) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const getCurrentTheme = () =>
      window?.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkTheme(getCurrentTheme);
  }, []);

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    darkThemeMq.addEventListener('change', (e) => {
      mqListener(e);
    });
    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  return isDarkTheme;
};

export default useThemeDetector;
