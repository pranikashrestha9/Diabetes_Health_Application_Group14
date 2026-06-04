import { Runner } from "../../global/global";
import { Doctor } from "../../model/Doctor";
import { CreateUserInput } from "../user/user.schema";
import { CreateDoctorInput } from "./doctorData.schema";

export const DoctorRepository = {
  insert: async ({
    runner,
    data,
    user,
  }: Runner & {
    data: CreateDoctorInput;
    user: CreateUserInput;
  }) => {
    const repo = runner.manager.getRepository(Doctor);

    try {
      const doctor = repo.create({
        ...data,
        user, // 🔥 key relation
      });

      return await repo.save(doctor);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByUserId: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository(Doctor);

    try {
      const doctor = await repo.findOne({
        where: {
          user: { userId },
        },
      });

      return doctor;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  update: async ({
    runner,
    existingDoctorData,
    data,
  }: Runner & {
    existingDoctorData: Doctor;
    data: Partial<CreateDoctorInput>;
  }) => {
    try {
      const repo = runner.manager.getRepository(Doctor);
      Object.assign(existingDoctorData, data);
      return await repo.save(existingDoctorData);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
