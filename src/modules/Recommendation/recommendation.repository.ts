import { Runner } from "../../global/global";
import { Recommendation } from "../../model/Recommendation";
import { CreateRecommendationDTO } from "./recommendation.schema";

export const RecommendationRepository = {
  create: async ({
    runner,
    data,
  }: Runner & { data: CreateRecommendationDTO }) => {
    try {
      const repo = runner.manager.getRepository(Recommendation);
      const rec = repo.create(data);
      return await repo.save(rec);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByBookingId: async ({ runner, bookingId }: Runner & any) => {
    const repo = runner.manager.getRepository(Recommendation);
    try {
      return await repo.findOne({
        where: {
          booking: { id: bookingId },
        },
        relations: [
          "booking",
          "booking.patient",
          "booking.doctor",
          "booking.doctor.user",
        ],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findById: async ({ runner, id }: Runner & any) => {
    const repo = runner.manager.getRepository(Recommendation);
    try {
      return await repo.findOne({
        where: { id },
        relations: [
          "booking",
          "booking.patient",
          "booking.doctor",
          "booking.doctor.user",
        ],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  update: async ({ runner, id, data }: Runner & any) => {
    const repo = runner.manager.getRepository(Recommendation);
    try {
      await repo.update({ id }, data);

      return await repo.findOne({ where: { id } });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
