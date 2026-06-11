import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import { PaymentController } from "./payment.controller";
import { DoctorIdParam } from "../Doctor/doctorData.schema";
import ZOD from "../../middlewares/schemaValidator";

export const paymentRouter = (router: Router) => {
  router.post(
    "/doctor-finance-details/:doctorId",
    validateToken({ checkInternalManager: true }),
    ZOD.requestParser({
      schema: DoctorIdParam,
      type: "Params",
    }),
    PaymentController.getDoctorFinanceDetails,
  );
};
