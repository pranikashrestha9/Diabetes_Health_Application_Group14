
import { Runner } from "../../global/global";

export const newsletterRepository = {
  save: async ({ runner, email }: Runner & {  email: string }) => {
    const repo = runner.manager.getRepository("Newsletter");
    try {
      const newsletter = repo.create({ email });
      const result = await repo.save(newsletter);
      return result;
    } catch (error) {
      console.error("Error saving newsletter:", error);
      throw error;
    }
  },
  isEmailExist: async ({ runner, email }: Runner & { email: string }) => {
    const repo = runner.manager.getRepository("Newsletter");
    try {
      const newsletter = await repo.findOne({ where: { email } });
      return newsletter;
    } catch (error) {
      console.error("Error checking if email exists:", error);
      throw error;
    }
  }
};
