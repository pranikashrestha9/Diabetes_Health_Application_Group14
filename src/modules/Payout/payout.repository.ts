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

  getTotalPaidOut: async ({
    runner,
    doctorUserId,
  }: Runner & { doctorUserId: number }) => {
    const repo = runner.manager.getRepository(DoctorPayout);

    try {
      const result = await repo
        .createQueryBuilder("payout")
        .leftJoin("payout.doctor", "doctor")
        .leftJoin("doctor.user", "user")
        .select("SUM(payout.totalAmount)", "total")
        .where("user.userId = :doctorUserId", { doctorUserId }) // ✅ FIX
        .andWhere("payout.status = :status", { status: "PAID" })
        .getRawOne();

      return Number(result?.total || 0);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findWithItems: async ({
    runner,
    doctorUserId,
  }: Runner & { doctorUserId: number }) => {
    const repo = runner.manager.getRepository(DoctorPayout);

    try {
      return await repo.find({
        where: {
          doctor: {
            user: {
              userId: doctorUserId, // ✅ FIX
            },
          },
        },
        relations: [
          "items",
          "items.payment",
          "doctor",
          "doctor.user", // ⚠️ important
        ],
        order: { createdAt: "DESC" },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
