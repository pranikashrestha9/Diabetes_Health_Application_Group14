import { Runner } from "../../global/global";
import { Payment, PaymentStatus } from "../../model/Payment";


export const PaymentRepository = {
  create: async ({
    runner,
    booking,
    amount,
  }: Runner & {
    booking: any;
    amount: number;
  }) => {
    const repo = runner.manager.getRepository(Payment);

    try {
      const payment = repo.create({
        booking,
        amount,
        status: PaymentStatus.PAID, // since you're simulating payment
        transactionId: "TXN" + Date.now(),
        paidAt: new Date(),
      });

      return await repo.save(payment);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};