import { z } from "zod";

export const CreateRecommendationSchema = z.object({
 

  advice: z.string().min(3),

  dietPlan: z
    .object({
      breakfast: z.array(z.string()).optional(),
      lunch: z.array(z.string()).optional(),
      dinner: z.array(z.string()).optional(),
      snacks: z.array(z.string()).optional(),
      avoidFoods: z.array(z.string()).optional(),
    })
    .optional(),

  lifestyleChanges: z.string().optional(),
});

export type CreateRecommendationDTO = z.infer<typeof CreateRecommendationSchema>;