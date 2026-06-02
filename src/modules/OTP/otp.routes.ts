


import { Router } from "express";

import ZOD from "../../middlewares/schemaValidator";
import { otpController } from "./otp.controller";
import { otpGenerateSchema, otpVerifySchema } from "./otp.schema";


export const otpRoutes = (router:Router) => {
  router.post(
      "/otp/send",
      ZOD.requestParser(
        {
          schema: otpGenerateSchema,
          type: "Body",
        },
      ),
      otpController.getOTP,
    );
    router.post(
      "/otp/verify",
      ZOD.requestParser(
        {
          schema: otpVerifySchema,
          type: "Body",
        },
      ),
      otpController.verifyOTP,
    );
   }





