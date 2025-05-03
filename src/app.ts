import express from 'express';
import cors from 'cors';
import { appointmentsRouter } from './routes/appointments.routes';
import { errorHandler } from './middlewares/errorHandler';
import { initializeDatabase } from './database/database';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initializeDatabase().then(() => {
  console.log('Base de datos inicializada');
}).catch(err => {
  console.error('Error al inicializar la base de datos:', err);
});

// Routes
app.use('/api/appointments', appointmentsRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 