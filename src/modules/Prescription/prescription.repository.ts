import { Runner } from "../../global/global";
import { Prescription } from "../../model/Prescription";
import {
  CreatePrescriptionDTO,
  UpdatePrescriptionDTO,
} from "./prescription.schema";

export const PrescriptionRepository = {
  create: async ({
    runner,
    data,
  }: Runner & { data: CreatePrescriptionDTO }) => {
    try {
      const repo = runner.manager.getRepository(Prescription);

      const prescription = repo.create(data);
      return await repo.save(prescription);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByBookingId: async ({
    runner,
    bookingId,
  }: Runner & { bookingId: number }) => {
    return await runner.manager.getRepository(Prescription).findOne({
      where: { booking: { id: bookingId } },
      relations: [
        "booking",
        "booking.patient",
        "booking.doctor",
        "booking.doctor.user",
      ],
    });
  },

  update: async ({
    runner,
    prescription,
    data,
  }: Runner & { prescription: Prescription; data: UpdatePrescriptionDTO }) => {
    try {
      Object.assign(prescription, data);
      return await runner.manager.save(prescription);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
