import { Router } from "express";
import ZOD from "../../middlewares/schemaValidator";
import { CreateDoctorSchema } from "./doctorData.schema";
import { DoctorDataController } from "./doctorData.controller";
import { validateToken } from "../../auth/validateToken";

export const doctorDataRouter = (router: Router) => {
  router.post(
    "/doctor-data",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser({
      schema: CreateDoctorSchema,
      type: "Body",
    }),
    DoctorDataController.addDoctorData,
  );

  router.patch(
    "/doctor-data",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser({
      schema: CreateDoctorSchema.partial(),
      type: "Body",
    }),
    DoctorDataController.updateDoctorData,
  );

  router.get(
    "/doctor-data",
    validateToken({ checkDoctor: true }),
    DoctorDataController.getDoctorData,
  );

  router.get(
    "/doctor-data/:doctorId",
    validateToken({ checkDoctor: true }),
    DoctorDataController.getDoctorDataByDoctorId,
  );
};
