import { CreatePatientInput, UpdatePatientInput } from "./patient.schema";
import { Request, Response, NextFunction } from "express";
import { Exception } from "../../libs/exceptionHandler";

import { messageFormater } from "../../libs/messageFormater";
import { PatientService } from "./patient.service";

export const PatientController = {
  // ✅ Create Patient (with User handled in service)
  addPatientMedicalData: async (
    req: Request<{}, {}, CreatePatientInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const userId = req.tokenPayload.userId;

      const response = await PatientService.addPatientMedicalData({
        userId: userId,
        patientData: data,
      });

      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully created patient", 201),
        );
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get All Patients
//   getAllPatients: async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const response = await PatientService.getAllPatients();

//       res
//         .status(200)
//         .json(messageFormater(true, response, "All patient data", 200));
//     } catch (error) {
//       next(error);
//     }
//   },

  // ✅ Get Patient By UserId
  getPatientMedicalDataByUserId: async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;

      const response = await PatientService.getMedicalData(parseInt(userId));

      if (!response) {
        throw new Exception("Patient medical data not found", 404);
      }

      res
        .status(200)
        .json(messageFormater(true, response, "Patient medical data", 200));
    } catch (error) {
      next(error);
    }
  },

  // ✅ Update Patient
//   updatePatient: async (
//     req: Request<{ userId: string }, {}, UpdatePatientInput>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const { userId } = req.params;
//       const data = req.body;

//       const response = await PatientService.updatePatientByUserId(userId, data);

//       res
//         .status(200)
//         .json(
//           messageFormater(true, response, "Successfully updated patient", 200),
//         );
//     } catch (error) {
//       next(error);
//     }
//   },

  // ✅ Delete Patient
  deletePatient: async (
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const id = Number(userId);

      const response = await PatientService.deletePatientById(id);

      res
        .status(200)
        .json(
          messageFormater(true, response, "Successfully deleted patient", 200),
        );
    } catch (error) {
      next(error);
    }
  },

  // ✅ Update Patient Status (via User)
//   updatePatientStatus: async (
//     req: Request<{ userId: string }>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const { userId } = req.params;
//       const data = req.body;

//       const response = await PatientService.updatePatient(userId, data);

//       res
//         .status(200)
//         .json(
//           messageFormater(
//             true,
//             response,
//             "Successfully updated patient status",
//             200,
//           ),
//         );
//     } catch (error) {
//       next(error);
//     }
//   },
};
