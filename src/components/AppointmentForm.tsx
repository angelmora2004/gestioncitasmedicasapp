import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Appointment {
  id?: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
}

const AppointmentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment>({
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    reason: '',
    status: 'pendiente'
  });

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`https://gestioncitasmedicasapp-production.up.railway.app/api/appointments/${id}`);
      setAppointment(response.data);
    } catch (error) {
      console.error('Error al obtener la cita:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`https://gestioncitasmedicasapp-production.up.railway.app/api/appointments/${id}`, appointment);
      } else {
        await axios.post('https://gestioncitasmedicasapp-production.up.railway.app/api/appointments', appointment);
      }
      navigate('/');
    } catch (error) {
      console.error('Error al guardar la cita:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Editar Cita' : 'Nueva Cita'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Paciente"
              name="patientName"
              value={appointment.patientName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Doctor"
              name="doctorName"
              value={appointment.doctorName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de la Cita"
              name="appointmentDate"
              type="datetime-local"
              value={appointment.appointmentDate}
              onChange={handleChange}
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
              value={appointment.status}
              onChange={handleChange}
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
              value={appointment.reason}
              onChange={handleChange}
              required
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AppointmentForm; 