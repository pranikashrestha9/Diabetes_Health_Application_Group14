import path from "path";
import { MulterHelper } from "../../middlewares/multer";
import ZOD from "../../middlewares/schemaValidator";
import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import { CreatePatientSchema } from "./patient.schema";
import { PatientController } from "./patient.controller";

export const patientRoutes = (router: Router) => {
  router.post(
    "/patient-data",
    // validateToken({ checkAdmin: true }),
     (req) => console.log("hello",req.body),
    ZOD.requestParser({
      schema: CreatePatientSchema,
      type: "Body",
    }),
    // (req) => console.log(req),
    PatientController.addPatientMedicalData,
  );

  router.delete(
    "/patient/:id",
    // validateToken({ checkAdmin: true }),
    PatientController.deletePatient,
  );
//   router.patch(
//     "/jobseeker/:id",
//     // validateToken({ checkAdmin: true }),
//     //(req) => console.log("hello",req.body),
//     ZOD.requestParser(
//       {
//         schema: jobseekerIdSchema,
//         type: "Params",
//       },
//       {
//         schema: createJobseekerSchema.partial(),
//         type: "Body",
//       },
//     ),
//     JobSeekerController.updateJobSeekerById,
//   );
//   router.patch(
//     "/jobseeker/cv/:id",
//     // validateToken({ checkAdmin: true }),
//     MulterHelper.getStorage(path.resolve("public/CV"), {
//       moduleName: "jobseeker",
//       isFile: true,
//     }).single("jobseekerCV"),

//     ZOD.requestParser(
//       {
//         schema: jobseekerIdSchema,
//         type: "Params",
//       },
//       {
//         schema: createJobseekerSchema.partial(),
//         type: "Body",
//       },
//     ),
//     JobSeekerController.updateCV,
//   );
//   router.patch(
//     "/jobseeker/status/:id",
//     // no Zod here — body is { isActive } which is not in createJobseekerSchema
//     JobSeekerController.updateSeekerStatus,
//   );
};
