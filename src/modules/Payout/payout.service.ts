import ORMHelper from "../../libs/ORMHelper";
import { Payment } from "../../model/Payment";
import { DoctorRepository } from "../Doctor/doctorData.repository";
import { PaymentRepository } from "../Payment/payment.repository";
import { PayoutItemRepository } from "../PayoutItem/payoutItem.repository";
import { PayoutRepository } from "./payout.repository";

export const PayoutService = {
  createPayout: async (data: {
    doctorUserId: number;
    markAsPaid?: boolean;
  }) => {
    const runner = await ORMHelper.createQueryRunner();
    await runner.startTransaction();

    try {
      const { doctorUserId, markAsPaid } = data;

      const doctor = await DoctorRepository.findByUserId({
        runner,
        userId: doctorUserId,
      });

      if (!doctor) {
        throw new Error("Doctor not found");
      }
      const doctorId = doctor.id;

      // ✅ 1. AUTO FETCH ALL PAID PAYMENTS
      const payments = await PaymentRepository.findPaidByDoctor({
        runner,
        doctorUserId,
      });

      console.log(
        "🚀 ~ file: payout.service.ts:22 ~ createPayout: ~ payments:",
        payments,
      );

      if (!payments.length) {
        throw new Error("No paid payments found for this doctor");
      }

      // ✅ 2. Check already processed payouts
      const existing = await PayoutItemRepository.findExistingByPaymentIds({
        runner,
        paymentIds: payments.map((p: Payment) => p.paymentId),
      });

      if (existing.length > 0) {
        throw new Error("Some payments already included in payout");
      }

      // ✅ 3. Calculate earnings
      let totalAmount = 0;

      const items = payments.map((p: Payment) => {
        const doctorEarning = p.amount * 0.8; // FIXED RULE
        totalAmount += doctorEarning;

        return {
          payment: p,
          doctorEarning,
        };
      });

      // ✅ 4. Create payout
      const payout = await PayoutRepository.create({
        runner,
        doctorId,
        totalAmount,
        status: markAsPaid ? "PAID" : "PENDING",

        paidAt: markAsPaid ? new Date() : null,
      });

      // ✅ 5. Save payout items
      for (const item of items) {
        await PayoutItemRepository.create({
          runner,
          payout,
          payment: item.payment,
          doctorEarning: item.doctorEarning,
        });
      }

      await PaymentRepository.markAsSettled({
        runner,
        paymentIds: payments.map((p: Payment) => p.paymentId),
      });

      await runner.commitTransaction();

      return {
        payoutId: payout.payoutId,
        totalAmount,
        totalPayments: items.length,
        status: payout.status,
      };
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
