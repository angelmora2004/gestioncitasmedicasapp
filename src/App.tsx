import React, { useState, useMemo, useEffect } from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#18191a' : '#f4f6fa',
        paper: darkMode ? '#242526' : '#fff',
      },
      primary: {
        main: '#1976d2',
      },
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
        <Sidebar setSearch={function (value: string): void {
          throw new Error('Function not implemented.');
        } } />
        <Box sx={{ flexGrow: 1 }}>
          <Navbar setSearch={setSearch} darkMode={darkMode} setDarkMode={setDarkMode} />
          <Dashboard search={search} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 