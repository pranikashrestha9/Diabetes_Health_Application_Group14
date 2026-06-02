import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { UserRepository } from "./user.repository";
import { CreateUserInput } from "./user.schema";

export const UserService = {
  updateUser: async (id: number, data: Partial<CreateUserInput>) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const existingData = await UserRepository.findById({
        runner,
        userId: id,
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
};
