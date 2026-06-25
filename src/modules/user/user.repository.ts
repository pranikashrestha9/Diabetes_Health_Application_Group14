import { Runner } from "../../global/global";
import { hashPassword } from "../../libs/passhash";
import { User } from "../../model/BaseEntity";
import { CreateUserInput } from "./user.schema";

export const UserRepository = {
  insert: async ({ runner, data }: Runner & { data: CreateUserInput }) => {
    const repo = runner.manager.getRepository(User);

    try {
      const hashedPassword = await hashPassword(data.password);

      const user = repo.create({
        ...data,
        password: hashedPassword,
      });

      return await repo.save(user);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findById: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository(User);

    try {
      return await repo.findOne({
        where: { userId },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByEmail: async ({ runner, email }: Runner & { email: string }) => {
    const repo = runner.manager.getRepository(User);

    try {
      return await repo.findOne({
        where: { email },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  update: async ({
    runner,
    existingUser,
    data,
  }: Runner & {
    existingUser: User;
    data: Partial<CreateUserInput>;
  }) => {
    const repo = runner.manager.getRepository(User);

    try {
      Object.assign(existingUser, data);
      return await repo.save(existingUser);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAll: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(User);
    try {
      return await repo.find();
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  delete: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository(User);
    try {
      return await repo.delete({ userId: userId });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findUserWithMedicalData: async ({
    runner,
    userId,
  }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository(User);

    try {
      return await repo.findOne({
        where: { userId },
        relations: ["patient"],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAllDoctors: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(User);
    try {
      const doctors = await repo.find({
        where: { role: "DOCTOR" },
      });
      return doctors;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAllPatients: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(User);
    try {
      const patients = await repo.find({ where: { role: "PATIENT" } });
      return patients;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAllContentManagers: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(User);
    try {
      const contentManagers = await repo.find({
        where: { role: "CONTENT_MANAGER" },
      });
      return contentManagers;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
  updateProfileImage: async ({
    runner,
    user,
    profileImageURL,
  }: Runner & { user: User; profileImageURL: string }) => {
    const repo = runner.manager.getRepository(User);
    try {
      user.profileImageURL = profileImageURL;

      return await repo.save(user);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  //   update: async ({
  //     runner,
  //     existingUser,
  //     data,
  //   }: Runner & {
  //     existingUser: User;
  //     data: Partial<CreateUserInput>;
  //   }) => {
  //     const repo = runner.manager.getRepository(User);
  //     try {
  //       Object.assign(existingUser, data);
  //       return await repo.save(existingUser);
  //     } catch (error: any) {
  //       error.level = "DB";
  //       throw error;
  //     }
  //   },
};
