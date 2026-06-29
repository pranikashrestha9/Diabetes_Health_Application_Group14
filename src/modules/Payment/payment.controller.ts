import { Request, Response, NextFunction } from "express";
import { DoctorIdParamType } from "../Doctor/doctorData.schema";
import { PaymentService } from "./payment.service";
import { messageFormater } from "../../libs/messageFormater";

export const PaymentController = {
  getDoctorFinanceDetails: async (
    req: Request<DoctorIdParamType, {}, {}, { settled?: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const doctorUserId = Number(req.params.doctorId);

      // 👇 NEW
      const { settled } = req.query;

      const response = await PaymentService.getDoctorFinanceDetails(
        doctorUserId,
        settled as string | undefined,
      );

      if (!response) {
        return res
          .status(404)
          .json(messageFormater(false, "No payment data found", null, 404));
      }

      res
        .status(200)
        .json(messageFormater(true, "Doctor finance details", response, 200));
    } catch (error) {
      next(error);
    }
  },
};
