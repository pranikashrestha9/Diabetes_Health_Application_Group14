import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { unsyncFromPublic } from "../../libs/unsync";
import { User } from "../../model/User";
import { BookingRepository } from "../Booking/booking.repository";
import { UserRepository } from "./user.repository";
import { CreateUserInput } from "./user.schema";

export const UserService = {
  updateUser: async (userId: number, data: Partial<CreateUserInput>) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      await ORMHelper.createTransaction(runner);
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

      const user = await UserRepository.findUserWithMedicalData({
        runner,
        userId,
      });
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

  getUserWithDoctorData: async (userId: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isuserExist = await UserRepository.findById({ runner, userId });
      if (!isuserExist) {
        throw new Exception("User not found", 404);
      }

      const user = await UserRepository.findUserWithDoctorData({
        runner,
        userId,
      });
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
      const contentManagers = await UserRepository.findAllContentManagers({
        runner,
      });
      return contentManagers;
    } catch (error) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  updateProfileImage: async ({
    userId,
    profileImageURL,
  }: {
    userId: number;
    profileImageURL: string;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      const user: User = await UserRepository.findById({
        runner,
        userId,
      });

      if (!user) {
        throw new Exception("User not found", 404);
      }

      // ✅ DELETE OLD IMAGE
      if (
        user.profileImageURL &&
        !user.profileImageURL.includes("default.png")
      ) {
        console.log("🗑 Removing old image:", user.profileImageURL);

        unsyncFromPublic(user.profileImageURL);
      }

      // ✅ SAVE NEW IMAGE
      await UserRepository.updateProfileImage({
        runner,
        user,
        profileImageURL,
      });

      await ORMHelper.commitTransaction(runner);

      return {
        message: "Profile image updated successfully",
        profileImageURL,
      };
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);

      // ❗ cleanup uploaded file if DB fails
      if (profileImageURL) {
        unsyncFromPublic(profileImageURL);
      }

      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
