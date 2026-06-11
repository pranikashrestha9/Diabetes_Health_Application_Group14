import { z } from "zod";

export const createPayoutSchema = z.object({


  markAsPaid: z.boolean().default(true),

});