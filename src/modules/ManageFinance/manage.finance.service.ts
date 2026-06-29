import ORMHelper from "../../libs/ORMHelper";
import { PaymentRepository } from "../Payment/payment.repository";
import { PayoutRepository } from "../Payout/payout.repository";

export const ManageFinanceService = {
  getSummary: async (doctorId: number) => {
    const payments = await PaymentRepository.findByDoctorId({
      runner: await ORMHelper.createQueryRunner(),
      doctorId,
    });

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    const totalDoctorEarning = payments.reduce(
      (sum: number, p: any) => sum + p.amount * 0.8,
      0,
    );

    const totalPaidOut = await PayoutRepository.getTotalPaidOut({runner: await ORMHelper.createQueryRunner(), doctorUserId: doctorId});

    const pendingPayout = totalDoctorEarning - totalPaidOut;

    return {
      totalRevenue,
      totalDoctorEarning,
      totalPaidOut,
      pendingPayout,
    };
  },

  getPaymentHistory: async (doctorId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      return await PaymentRepository.findDetailedByDoctor({
        runner,
        doctorUserId: doctorId,
      });
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  getPayoutHistory: async (doctorId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      return await PayoutRepository.findWithItems({
        runner,
        doctorUserId: doctorId,
      });
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
