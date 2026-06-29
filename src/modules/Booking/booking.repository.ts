import { Runner } from "../../global/global";
import { Booking } from "../../model/Booking";

export const BookingRepository = {
  create: async ({ runner, data }: Runner & { data: any }) => {
    const repo = runner.manager.getRepository(Booking);

    try {
      const booking = repo.create(data);
      return await repo.save(booking);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findConflict: async ({
    runner,
    doctorIda,
    bookingDate,
    startTime,
    endTime,
  }: Runner & any) => {
    const repo = runner.manager.getRepository(Booking);

    return await repo
      .createQueryBuilder("booking")
      .where("booking.doctorId = :doctorId", { doctorId: doctorIda })
      .andWhere("booking.bookingDate = :date", { date: bookingDate })
      .andWhere(
        "(booking.startTime < :endTime AND booking.endTime > :startTime)",
        { startTime, endTime },
      )
      .getOne();
  },

    updateStatus: async ({
    runner,
    booking,
    status,
  }: Runner & {
    booking: Booking;
    status: "CONFIRMED" | "CANCELLED";
  }) => {
    const repo = runner.manager.getRepository(Booking);

    booking.status = status;

    return await repo.save(booking);
  },


   findById: async ({ runner, id }: Runner & { id: number }) => {
    const repo = runner.manager.getRepository(Booking);

    return await repo.findOne({
      where: { id },
      relations: ["patient", "doctor", "doctor.user","payment", "patient.user"],
    });
  },


  findByPatientId: async ({ runner, userId }:Runner & { userId: number }) => {
  return await runner.manager.getRepository(Booking).find({
    where: {
      patient: { userId },
    },
    relations: ["patient", "doctor", "doctor.user"],
  });
},

findByDoctorUserId: async ({ runner, userId }:Runner & { userId: number }) => {
  return await runner.manager.getRepository(Booking).find({
    where: {
      doctor: {
        user: { userId },
      },
    },
    relations: ["patient", "doctor", "doctor.user"],
  });
},
};
