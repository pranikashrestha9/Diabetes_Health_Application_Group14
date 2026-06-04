import { CreatePatientInput } from "./patient.schema";
import ORMHelper from "../../libs/ORMHelper";
import { UserRepository } from "../user/user.repository";
import { CreateUserInput } from "../user/user.schema";
import { PatientRepository } from "./patient.repository";
import { Exception } from "../../libs/exceptionHandler";

export const PatientService = {
 addPatientMedicalData: async ({
  userId,
  patientData,
}: {
  userId: number;
  patientData: CreatePatientInput;
}) => {
  const runner = await ORMHelper.createQueryRunner();

  try {
    await ORMHelper.createTransaction(runner);

    // ✅ 1. Find user
    const user = await UserRepository.findById({
      runner,
      userId,
    });

    if (!user) {
      throw new Exception("User not found", 404);
    }

    // ✅ 2. Ensure role is PATIENT
    if (user.role !== "PATIENT") {
      throw new Exception("User is not a patient", 400);
    }

    // ✅ 3. Check if patient already exists (by user relation)
    const existingPatient = await PatientRepository.findByUserId({
      runner,
      userId,
    });

    if (existingPatient) {
      throw new Exception("Patient medical data already exists", 400);
    }

    // ✅ 4. Create Patient record
    const patient = await PatientRepository.insert({
      runner,
      data: patientData,
      user,
    });

    await ORMHelper.commitTransaction(runner);

    return patient;
  } catch (error) {
    await ORMHelper.rollBackTransaction(runner);
    throw error;
  }finally {
    ORMHelper.release(runner);
  }
},

  getMedicalData: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await PatientRepository.findByUserId({ runner, userId });

      return response;
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  //   getPatientById: async (id: number) => {
  //     const runner = await ORMHelper.createQueryRunner();
  //     try {
  //       const response = await PatientRepository.findById({ runner, id });
  //       return response;
  //     } catch (error: any) {
  //       throw error;
  //     } finally {
  //       ORMHelper.release(runner);
  //     }
  //   },

  getJobSeekerByEmail: async (email: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await PatientRepository.findByEmailId({ runner, email });
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  deletePatientById: async (patientId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await PatientRepository.deleteById({
        runner,
        patientId,
      });
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
    updateMedicalData: async (
      userId: number,
      data: Partial<CreatePatientInput>,
    ) => {
      const runner = await ORMHelper.createQueryRunner();
      try {
        const patient = await PatientRepository.findByUserId({ runner, userId });
        if (!patient) {
          throw new Exception("Patient not found", 404);
        }

        const response = await PatientRepository.updatePatientMedicalData({
          runner,
          existingPatient: patient,
          data,
        });
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        ORMHelper.release(runner);
      }
    },

  //   updateIsActiveStatus: async (
  //     id: number,
  //     data: Partial<CreatePatientInput> & { isActive: boolean },
  //   ) => {
  //     const runner = await ORMHelper.createQueryRunner();
  //     try {
  //       const patient = await PatientRepository.findById({ runner, id });
  //       if (!patient) {
  //         throw new Exception("Patient not found", 404);
  //       }
  //       const response = await PatientRepository.updatePatientMedicalData({
  //         runner,
  //         existingData: patient,
  //         data,
  //       });
  //       return response;
  //     } catch (error: any) {
  //       throw error;
  //     } finally {
  //       ORMHelper.release(runner);
  //     }
  //   },
};
