import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Container
} from '@mui/material';
import axios from 'axios';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt: string;
}

interface AppointmentListProps {
  search: string;
  refreshCounts: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ search, refreshCounts }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAppointment, setEditAppointment] = useState<Partial<Appointment>>({});
  const [loading, setLoading] = useState(true);
  const [matchingAppointments, setMatchingAppointments] = useState<Appointment[]>([]);
  const [openMatchesDialog, setOpenMatchesDialog] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Buscar coincidencias cuando search cambie
  useEffect(() => {
    if (search && search.trim().length > 0) {
      const matches = appointments.filter(app =>
        app.reason.toLowerCase().includes(search.trim().toLowerCase())
      );
      if (matches.length > 0) {
        setMatchingAppointments(matches);
        setOpenMatchesDialog(true);
        setShowNotFound(false);
      } else {
        setMatchingAppointments([]);
        setOpenMatchesDialog(false);
        setShowNotFound(true);
      }
    } else {
      setMatchingAppointments([]);
      setOpenMatchesDialog(false);
      setShowNotFound(false);
    }
  }, [search, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:3001/api/appointments/${id}/status`, {
        status: newStatus
      });
      await fetchAppointments();
      refreshCounts();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/appointments/${id}`);
      fetchAppointments();
      refreshCounts();
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/appointments/${id}`);
      setSelectedAppointment(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Error al obtener los detalles de la cita:', error);
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/appointments/${id}`);
      setEditAppointment(response.data);
      setOpenEditDialog(true);
    } catch (error) {
      console.error('Error al obtener los datos para editar:', error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      if (editAppointment.id) {
        // Actualiza los datos generales
        await axios.put(`http://localhost:3001/api/appointments/${editAppointment.id}`, {
          patientName: editAppointment.patientName,
          doctorName: editAppointment.doctorName,
          appointmentDate: editAppointment.appointmentDate,
          reason: editAppointment.reason
        });

        // Actualiza el estado por separado
        if (editAppointment.status) {
          await axios.patch(`http://localhost:3001/api/appointments/${editAppointment.id}/status`, {
            status: editAppointment.status
          });
        }

        await fetchAppointments();
        refreshCounts();
        setOpenEditDialog(false);
      }
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'warning';
      case 'confirmada':
        return 'success';
      case 'cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSelectMatch = async (id: number) => {
    setOpenMatchesDialog(false);
    await handleViewDetails(id);
  };

  if (loading) {
    return (
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2000,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(24,25,26,0.85)' : 'rgba(255,255,255,0.8)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2
        }}>
          <CircularProgress 
            size={80} 
            thickness={4}
            sx={{ 
              color: 'primary.main',
              animationDuration: '1.5s'
            }} 
          />
          <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : 'primary.main' }}>
            Cargando citas...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', overflowX: { xs: 'auto', sm: 'visible' } }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Paciente
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <PersonAddIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Doctor
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <CalendarMonthIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Fecha
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Razón
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Estado
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                <BuildIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 18, sm: 24 } }} /> Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>{appointment.patientName}</TableCell>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>{appointment.doctorName}</TableCell>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>{appointment.reason}</TableCell>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status) as any}
                    sx={{ fontSize: { xs: 11, sm: 14 }, height: { xs: 22, sm: 28 } }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: 12, sm: 16 }, px: { xs: 1, sm: 2 } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(appointment.id)}
                    style={{ marginRight: '8px' }}
                    sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
                  >
                    <VisibilityIcon sx={{ mr: { sm: 1, xs: 0 }, fontSize: { xs: 18, sm: 22 } }} fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Ver</Box>
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleEditClick(appointment.id)}
                    style={{ marginRight: '8px' }}
                    sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
                  >
                    <EditIcon sx={{ mr: { sm: 1, xs: 0 }, fontSize: { xs: 18, sm: 22 } }} fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Actualizar</Box>
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(appointment.id)}
                    sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
                  >
                    <DeleteIcon sx={{ mr: { sm: 1, xs: 0 }, fontSize: { xs: 18, sm: 22 } }} fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Eliminar</Box>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Visualización */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Cita</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Información del Paciente
              </Typography>
              <Typography><strong>Nombre:</strong> {selectedAppointment.patientName}</Typography>
              <Typography><strong>Doctor:</strong> {selectedAppointment.doctorName}</Typography>
              <Typography><strong>Fecha:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString()}</Typography>
              <Typography><strong>Estado:</strong> 
                <Chip
                  label={selectedAppointment.status}
                  color={getStatusColor(selectedAppointment.status) as any}
                  style={{ marginLeft: '8px' }}
                />
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Razón de la Cita
              </Typography>
              <Typography>{selectedAppointment.reason}</Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Información Adicional
              </Typography>
              <Typography><strong>Fecha de Creación:</strong> {new Date(selectedAppointment.createdAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edición */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Cita</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Paciente"
                  name="patientName"
                  value={editAppointment.patientName || ''}
                  onChange={handleEditChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Doctor"
                  name="doctorName"
                  value={editAppointment.doctorName || ''}
                  onChange={handleEditChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de la Cita"
                  name="appointmentDate"
                  type="datetime-local"
                  value={editAppointment.appointmentDate || ''}
                  onChange={handleEditChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="status"
                  select
                  value={editAppointment.status || ''}
                  onChange={handleEditChange}
                  required
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Razón de la Cita"
                  name="reason"
                  value={editAppointment.reason || ''}
                  onChange={handleEditChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de coincidencias de búsqueda */}
      <Dialog open={openMatchesDialog} onClose={() => setOpenMatchesDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Coincidencias encontradas</DialogTitle>
        <DialogContent>
          {matchingAppointments.length === 0 ? (
            <Typography>No se encontraron coincidencias.</Typography>
          ) : (
            <Box>
              {matchingAppointments.map(app => (
                <Box key={app.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, cursor: 'pointer', '&:hover': { background: '#f5f5f5' } }} onClick={() => handleSelectMatch(app.id)}>
                  <Typography variant="subtitle1"><b>Paciente:</b> {app.patientName}</Typography>
                  <Typography variant="subtitle2"><b>Doctor:</b> {app.doctorName}</Typography>
                  <Typography variant="body2"><b>Razón:</b> {app.reason}</Typography>
                  <Typography variant="body2"><b>Fecha:</b> {new Date(app.appointmentDate).toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMatchesDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de no encontrado */}
      <Dialog open={showNotFound} onClose={() => setShowNotFound(false)} maxWidth="xs">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            ¡No se encontró ninguna cita!
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            No hay ninguna cita cuya razón coincida con tu búsqueda.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setShowNotFound(false)} color="error" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentList; 