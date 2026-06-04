import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { UserRepository } from "./user.repository";
import { CreateUserInput } from "./user.schema";

export const UserService = {
  updateUser: async (userId: number, data: Partial<CreateUserInput>) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const existingData = await UserRepository.findById({
        runner,
        userId: userId,
      });
      if (!existingData) {
        throw new Exception("User not found", 404);
      }
      const response = await UserRepository.update({
        runner,
        existingUser: existingData,
        data,
      });
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  createUser: async (data: CreateUserInput) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      // ✅ 1. Check if email already exists
      const existingUser = await UserRepository.findByEmail({
        runner,
        email: data.email,
      });

      if (existingUser) {
        throw new Exception("User with this email already exists", 400);
      }

      // ✅ 2. Create user
      const user = await UserRepository.insert({
        runner,
        data,
      });

      // ❗ remove password before returning
      delete (user as any).password;

      await ORMHelper.commitTransaction(runner);

      return user;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getAllUsers: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const users = await UserRepository.findAll({ runner });
      return users;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getUserById: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const user = await UserRepository.findById({ runner, userId });
      if (user) {
        delete (user as any).password;
      }
      return user;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  deleteUser: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await UserRepository.delete({ runner, userId });
      return response;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
  getUserWithMedicalData: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {

      const isuserExist = await UserRepository.findById({ runner, userId });
      if (!isuserExist) {
        throw new Exception("User not found", 404);
      }
      
      const user = await UserRepository.findUserWithMedicalData({ runner, userId });
      if (user) {
        delete (user as any).password;
      }
      return user;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

   getAllDoctors: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const doctors = await UserRepository.findAllDoctors({ runner });
      return doctors;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

   getAllPatients: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const patients = await UserRepository.findAllPatients({ runner });
      return patients;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getAllContentManagers: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const contentManagers = await UserRepository.findAllContentManagers({ runner });
      return contentManagers;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  }
};
