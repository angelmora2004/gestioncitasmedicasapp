export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  reason: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada'; 