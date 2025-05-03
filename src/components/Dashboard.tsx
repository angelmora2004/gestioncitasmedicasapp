import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import AppointmentList from './AppointmentList';
import axios from 'axios';

interface DashboardProps {
  search: string;
}

const Dashboard: React.FC<DashboardProps> = ({ search }) => {
  const [counts, setCounts] = useState({ pendiente: 0, confirmada: 0, cancelada: 0 });

  const fetchCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/appointments/counts');
      setCounts(response.data);
    } catch (error) {
      console.error('Error al obtener los conteos de citas:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 4 }, marginTop: { xs: '56px', sm: '64px' } }}>
      <Typography variant="h5" fontWeight={700} mb={4} sx={{ fontSize: { xs: 18, sm: 24 } }}>
        Bienvenido <span style={{ color: '#1976d2' }}>usuario</span>
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }} mb={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #ff9800', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: 15, sm: 20 } }}>Pendientes</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 22, sm: 32 } }}>{counts.pendiente}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #4caf50', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: 15, sm: 20 } }}>Confirmadas</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 22, sm: 32 } }}>{counts.confirmada}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderLeft: '6px solid #f44336', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: 15, sm: 20 } }}>Canceladas</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 22, sm: 32 } }}>{counts.cancelada}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ fontSize: { xs: 15, sm: 20 } }}>
        Lista de Citas
      </Typography>
      <Box mt={{ xs: 2, sm: 4 }}>
        <AppointmentList search={search} refreshCounts={fetchCounts} />
      </Box>
    </Box>
  );
};

export default Dashboard;
