import ORMHelper from "../../libs/ORMHelper";
import { PaymentRepository } from "./payment.repository";

export const PaymentService = {
  getDoctorFinanceDetails: async (doctorUserId: number) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      return await PaymentRepository.getDoctorFinanceDetails({
        runner,
        doctorUserId,
      });
    } finally {
      ORMHelper.release(runner);
    }
  },
};