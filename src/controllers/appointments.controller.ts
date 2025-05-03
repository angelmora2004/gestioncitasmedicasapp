import { Request, Response } from 'express';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { db } from '../database/database';

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await db.all('SELECT * FROM appointments');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await db.get('SELECT * FROM appointments WHERE id = ?', id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cita' });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientName, doctorName, appointmentDate, reason } = req.body;
    const createdAt = new Date().toISOString();
    const status: AppointmentStatus = 'pendiente';

    const result = await db.run(
      'INSERT INTO appointments (patientName, doctorName, appointmentDate, reason, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [patientName, doctorName, appointmentDate, reason, status, createdAt]
    );

    const newAppointment = await db.get('SELECT * FROM appointments WHERE id = ?', result.lastID);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cita' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patientName, doctorName, appointmentDate, reason } = req.body;

    await db.run(
      'UPDATE appointments SET patientName = ?, doctorName = ?, appointmentDate = ?, reason = ? WHERE id = ?',
      [patientName, doctorName, appointmentDate, reason, id]
    );

    const updatedAppointment = await db.get('SELECT * FROM appointments WHERE id = ?', id);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cita' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM appointments WHERE id = ?', id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cita' });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendiente', 'confirmada', 'cancelada'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    await db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    const updatedAppointment = await db.get('SELECT * FROM appointments WHERE id = ?', id);
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la cita' });
  }
};

export const getAppointmentCounts = async (req: Request, res: Response) => {
  try {
    const counts = await db.get(`
      SELECT
        SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END) as pendiente,
        SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmada,
        SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as cancelada
      FROM appointments
    `);
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los conteos de citas' });
  }
}; 