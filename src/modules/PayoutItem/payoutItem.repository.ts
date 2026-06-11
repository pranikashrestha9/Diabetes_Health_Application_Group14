import { In } from "typeorm";
import { Runner } from "../../global/global";
import { Payment } from "../../model/Payment";
import { DoctorPayout } from "../../model/Payout";
import { PayoutItem } from "../../model/payoutItem";

export const PayoutItemRepository = {
  findExistingByPaymentIds: async ({
    runner,
    paymentIds,
  }: Runner & { paymentIds: number[] }) => {
    return await runner.manager.getRepository(PayoutItem).find({
      where: {
        payment: {
          paymentId: In(paymentIds),
        },
      },
      relations: ["payment"],
    });
  },

  create: async ({
    runner,
    payout,
    payment,
    doctorEarning,
  }: Runner & {
    payout: DoctorPayout;
    payment: Payment;
    doctorEarning: number;
  }) => {
    const repo = runner.manager.getRepository(PayoutItem);

    const entity = repo.create({
      payout,
      payment,
      doctorEarning,
    });

    return await repo.save(entity);
  },
};
