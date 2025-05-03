import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import 'boxicons';

interface NavbarProps {
  setSearch: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSearch, darkMode, setDarkMode }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{
      background: darkMode ? 'background.paper' : '#fff',
      color: darkMode ? 'text.primary' : '#1976d2',
      transition: 'background 0.3s',
    }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: { xs: 1, sm: 2 } }}>
        <LocalHospitalIcon sx={{ color: '#1976d2', fontSize: { xs: 24, sm: 32 }, mr: { xs: 0.5, sm: 1 } }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', fontSize: { xs: 16, sm: 24 } }}>
          Sistema de Gestion de Citas Medicas
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{
          position: 'relative',
          borderRadius: 2,
          background: darkMode ? '#23272f' : '#f0f2f5',
          width: { xs: 180, sm: 350 },
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}>
          <InputBase
            placeholder="Buscar razón de cita..."
            sx={{
              pl: 5,
              width: '100%',
              fontSize: { xs: 13, sm: 16 },
              color: darkMode ? '#fff' : '#222',
              '::placeholder': {
                color: darkMode ? '#fff' : '#18191a',
                opacity: 1,
              },
            }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={handleSearch} sx={{ position: 'absolute', left: 0, top: 0, height: '100%' }}>
            <SearchIcon sx={{ color: darkMode ? '#fff' : '#18191a' }} />
          </IconButton>
        </Box>
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ ml: 2 }} color="inherit">
          {darkMode ? <LightModeIcon sx={{ color: '#ffeb3b' }} /> : <DarkModeIcon sx={{ color: '#131442' }} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 