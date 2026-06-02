import { send } from "node:process";
import { OtpGenerateInput, OtpInput } from "./otp.schema";
import { Request, Response, NextFunction } from "express";
import { OTPService } from "./otp.service";

export const otpController = {
  //   getOTP: async (
  //     req: Request<OtpGenerateInput>,
  //     res: Response,
  //     next: NextFunction,
  //   ) => {
  //     try {
  //       const { email } = req.body;
  //       const otp = await OTPService.sendOTP({ email });
  //       const text = `Your OTP is: ${otp}`;
  //       res.status(200).json({ message: "OTP sent successfully", text });
  //     } catch (error) {
  //       next(error);
  //     }
  //   },

  getOTP: async (
    req: Request<OtpGenerateInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      const token = await OTPService.sendOTP({ email });

      res.status(200).json({
        message: "OTP sent successfully",
        token, // ⭐ send token to frontend
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOTP: async (req: Request<OtpInput>, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { otp } = req.body;

      const result = await OTPService.verifyOTP({ token: token!, otp });

      res.status(200).json({
        message: "OTP verified successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
