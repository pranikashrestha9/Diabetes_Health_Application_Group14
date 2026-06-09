export const formatBookingResponse = (booking: any) => {
  return {
    id: booking.id,
    status: booking.status,
    bookingDate: booking.bookingDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
    notes: booking.notes,
    meetLink: booking.meetLink,

    patient: {
      id: booking.patient.userId,
      name: `${booking.patient.firstName} ${booking.patient.lastName}`,
    },

    doctor: {
      id: booking.doctor.id,
      name: `Dr. ${booking.doctor.user.firstName} ${booking.doctor.user.lastName}`,
      specialization: booking.doctor.specialization,
    },
  };
};
