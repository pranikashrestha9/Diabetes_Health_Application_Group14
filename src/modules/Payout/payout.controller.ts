import { Response, Request, NextFunction } from "express";
import { PayoutService } from "./payout.service";
import { messageFormater } from "../../libs/messageFormater";
import { DoctorIdParamType } from "../Doctor/doctorData.schema";
import { UserIdInput } from "../user/user.schema";

export const PayoutController = {
  createPayout: async (
    req: Request<UserIdInput, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const doctorUserId = Number(req.params.userId);

      if (isNaN(doctorUserId)) {
        throw new Error("Invalid doctor user id");
      }
      const body = { doctorUserId, markAsPaid: true };

      const result = await PayoutService.createPayout(body);

      res
        .status(201)
        .json(
          messageFormater(true, "Payout created successfully", result, 201),
        );
    } catch (error) {
      next(error);
    }
  },

  
};
