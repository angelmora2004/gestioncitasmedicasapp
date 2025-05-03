import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getAppointmentCounts
} from '../controllers/appointments.controller';

const router = Router();

// Validación para crear/actualizar citas
const appointmentValidation = [
  body('patientName').notEmpty().withMessage('El nombre del paciente es requerido'),
  body('doctorName').notEmpty().withMessage('El nombre del doctor es requerido'),
  body('appointmentDate').notEmpty().withMessage('La fecha de la cita es requerida'),
  body('reason').notEmpty().withMessage('La razón de la cita es requerida')
];

// Rutas
router.get('/counts', getAppointmentCounts);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', appointmentValidation, createAppointment);
router.put('/:id', appointmentValidation, updateAppointment);
router.delete('/:id', deleteAppointment);
router.patch('/:id/status', updateAppointmentStatus);


export const appointmentsRouter = router; 