export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  place: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

export type BookingInput = {
  facilityId: string;
  doctorId: string;
  slot: string;
  reason?: string;
};