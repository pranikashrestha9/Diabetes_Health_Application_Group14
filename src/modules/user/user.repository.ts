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
      return await repo.delete({ id: userId });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  }
};
