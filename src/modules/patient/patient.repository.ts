import { Runner } from "../../global/global";
import { Patient } from "../../model/Patient";
import { CreateUserInput } from "../user/user.schema";
import { CreatePatientInput } from "./patient.schema";

export const PatientRepository = {
  insert: async ({
    runner,
    data,
    user,
  }: Runner & {
    data: CreatePatientInput;
    user: CreateUserInput;
  }) => {
    const repo = runner.manager.getRepository(Patient);

    try {
      const patient = repo.create({
        ...data,
        user, // 🔥 key relation
      });

      return await repo.save(patient);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByEmailId: async ({ runner, email }: Runner & { email: string }) => {
    const repo = runner.manager.getRepository(Patient);

    try {
      return await repo.findOne({
        where: {
          user: { email },
        },
        relations: ["user"],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAll: async ({ runner }: Runner) => {
    try {
      const repo = runner.manager.getRepository(Patient);
      return await repo.find({
        relations: ["user"],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  deleteById: async ({ runner, patientId }: Runner & { patientId: number }) => {
    const repo = runner.manager.getRepository("Patient");
    try {
      const result = await repo.delete({ id: patientId });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByUserId: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository(Patient);

    try {
      return await repo.findOne({
        where: {
          user: { userId: userId },
        },
        relations: ["user"],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  updatePatientMedicalData: async ({
    runner,
    existingPatient,
    data,
  }: Runner & {
    existingPatient: Patient;
    data: Partial<CreatePatientInput>;
  }) => {
    const repo = runner.manager.getRepository(Patient);
    try {
      Object.assign(existingPatient, data);
      return await repo.save(existingPatient);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
