import { Runner } from "../global/global";
import { loginSchemaInput, refreshTokenSchemaInput } from "./auth.schema";

export const authRepository = {
  getByEmail: async ({ runner, email }: Runner & { email: string }) => {
    const repo = runner.manager.getRepository("User");
    try {
      const result = await repo.findOne({ where: { email: email } });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
  getPassword: async ({ runner, email }: Runner & { email: string }) => {
    const repo = runner.manager.getRepository("User");
    try {
      const result = await repo.findOne({ where: { email: email } });
      return result?.password;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  storeRefreshToken: async ({
    runner,
    tokenData,
  }: Runner & { tokenData: refreshTokenSchemaInput }) => {
    const repo = runner.manager.getRepository("RefreshToken");
    try {
      const result = await repo.save(tokenData);
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  getUserRefreshTokens: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository("RefreshToken");
    try {
      const result = await repo.find({ where: { userId } });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  deleteAllUserRefreshTokens: async ({ runner, userId }: Runner & { userId: number }) => {
    const repo = runner.manager.getRepository("RefreshToken");
    try{
      const result = await repo.delete({ userId });
      return result;

    }catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

    deleteRefreshToken: async ({ runner, id }: Runner & { id: string }) => {
    const repo = runner.manager.getRepository("RefreshToken");
    try{
      const result = await repo.delete({ id });
      return result;

    }catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  updatePassword: async ({ runner, email, newPassword }: Runner & { email: string, newPassword: string }) => {
    const repo = runner.manager.getRepository("User");
    try {
      const result = await repo.update({ email }, { password: newPassword });
      
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
