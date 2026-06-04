import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { UserRepository } from "../user/user.repository";
import { DoctorRepository } from "./doctorData.repository";
import { CreateDoctorInput } from "./doctorData.schema";

export const DoctorDataService = {
  addDoctorData: async ({
    userId,
    doctorData,
  }: {
    userId: number;
    doctorData: CreateDoctorInput;
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

      // ✅ 2. Ensure role is DOCTOR
      if (user.role !== "DOCTOR") {
        throw new Exception("User is not a doctor", 400);
      }

      // ✅ 3. Check if doctor already exists (by user relation)
      const existingDoctor = await DoctorRepository.findByUserId({
        runner,
        userId,
      });

      if (existingDoctor) {
        throw new Exception("Doctor already exists", 400);
      }

      // ✅ 4. Create Doctor record
      const doctor = await DoctorRepository.insert({
        runner,
        data: doctorData,
        user,
      });

      await ORMHelper.commitTransaction(runner);

      return doctor;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getDoctorDataByUserId: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await DoctorRepository.findByUserId({ runner, userId });
      if (!response) {
        throw new Exception("Doctor not found", 404);
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  updateDoctorData: async ({
    userId,
    data,
  }: {
    userId: number;
    data: Partial<CreateDoctorInput>;
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

      // ✅ 2. Find existing doctor
      const existingDoctorData = await DoctorRepository.findByUserId({
        runner,
        userId,
      });

      if (!existingDoctorData) {
        throw new Exception("Doctor data not found", 404);
      }

      // ✅ 3. Update doctor data
      const updatedDoctor = await DoctorRepository.update({
        runner,
        existingDoctorData,
        data,
      });

      await ORMHelper.commitTransaction(runner);

      return updatedDoctor;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
};
