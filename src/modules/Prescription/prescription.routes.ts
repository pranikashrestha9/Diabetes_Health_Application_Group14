import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import {
  CreatePrescriptionSchema,
  UpdatePrescriptionSchema,
} from "./prescription.schema";
import ZOD from "../../middlewares/schemaValidator";
import { PrescriptionController } from "./prescription.controller";
import { bookingIdSchema } from "../Booking/booking.schema";

export const PrescriptionRoutes = (router: Router) => {
  router.post(
    "/prescription/:bookingId",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser(
      {
        schema: CreatePrescriptionSchema,
        type: "Body",
      },
      {
        schema: bookingIdSchema,
        type: "Params",
      },
    ),
    //(req) => console.log("hello", req.body),

    PrescriptionController.createPrescription,
  );

  router.patch(
    "/prescription/:bookingId",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser(
      {
        schema: UpdatePrescriptionSchema,
        type: "Body",
      },
      {
        schema: bookingIdSchema,
        type: "Params",
      },
    ),
    PrescriptionController.updatePrescription,
  );

  router.get(
    "/prescription/:bookingId",
    validateToken({ checkDoctor: true, checkPatient: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    PrescriptionController.getPrescription,
  );

  router.get(
    "/prescription/:bookingId/download",
    validateToken({ checkDoctor: true, checkPatient: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    PrescriptionController.downloadPrescription,
  );
};
