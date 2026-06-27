import { In } from "typeorm";
import { Runner } from "../../global/global";

import { DoctorPayout } from "../../model/Payout";
import { Payment } from "../../model/Payment";

export const PayoutRepository = {
  create: async ({
    runner,
    doctorId,
    totalAmount,
    status,
    paidAt,
  }: Runner & {
    doctorId: number;
    totalAmount: number;
    status: "PENDING" | "PAID";

    paidAt?: Date | null;
  }) => {
    const repo = runner.manager.getRepository(DoctorPayout);
    try {
      const entity = repo.create({
        doctor: { id: doctorId },
        totalAmount,
        status,

        paidAt: paidAt || null,
      });

      return await repo.save(entity);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },


};
