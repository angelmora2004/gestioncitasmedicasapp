import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

interface Appointment {
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
}

interface SidebarProps {
  setSearch: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSearch }) => {
  const [openModal, setOpenModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    status: 'pendiente'
  });
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const theme = useTheme();

  const handleNewAppointmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewAppointmentSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/api/appointments', newAppointment);
      setOpenModal(false);
      setNewAppointment({
        status: 'pendiente'
      });
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      setErrorModal(true);
      console.error('Error al crear la cita:', error);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: 60, sm: 220 },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: { xs: 60, sm: 220 },
            boxSizing: 'border-box',
            background: theme.palette.background.paper,
            marginTop: '64px',
            transition: 'background 0.3s',
          },
        }}
      >
        <Box sx={{ height: 16 }} />
        <List>
          <ListItem button component={Link} to="/" sx={{ px: { xs: 1, sm: 2 } }}>
            <ListItemIcon sx={{ minWidth: 0, mr: { xs: 0, sm: 2 } }}>
              <HomeIcon color="primary" sx={{ fontSize: { xs: 22, sm: 28 } }} />
            </ListItemIcon>
            <ListItemText primary="Citas" sx={{ display: { xs: 'none', sm: 'block' } }} />
          </ListItem>
          <ListItem button onClick={() => setOpenModal(true)} sx={{ px: { xs: 1, sm: 2 } }}>
            <ListItemIcon sx={{ minWidth: 0, mr: { xs: 0, sm: 2 } }}>
              <AddCircleIcon color="primary" sx={{ fontSize: { xs: 22, sm: 28 } }} />
            </ListItemIcon>
            <ListItemText primary="Nueva Cita" sx={{ display: { xs: 'none', sm: 'block' } }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Modal de Nueva Cita */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Cita</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Paciente"
                  name="patientName"
                  value={newAppointment.patientName || ''}
                  onChange={handleNewAppointmentChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Doctor"
                  name="doctorName"
                  value={newAppointment.doctorName || ''}
                  onChange={handleNewAppointmentChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha y Hora de la Cita"
                  name="appointmentDate"
                  type="datetime-local"
                  value={newAppointment.appointmentDate || ''}
                  onChange={handleNewAppointmentChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Razón de la Cita"
                  name="reason"
                  value={newAppointment.reason || ''}
                  onChange={handleNewAppointmentChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleNewAppointmentSubmit} variant="contained" color="primary">
            Crear Cita
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de éxito al crear cita */}
      <Dialog open={successModal} onClose={() => setSuccessModal(false)} maxWidth="xs">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" color="success.main" gutterBottom>
            ¡Cita creada con éxito!
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Modal de error al crear cita */}
      <Dialog open={errorModal} onClose={() => setErrorModal(false)} maxWidth="xs">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            ¡No se pudo crear la cita!
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Ocurrió un error al intentar crear la cita. Por favor, intenta de nuevo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setErrorModal(false)} color="error" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
