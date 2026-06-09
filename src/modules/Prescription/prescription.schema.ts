
import { z } from "zod";


export const MedicineSchema = z.object({
  name: z.string().min(1),
  dose: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().min(1),
});

export const CreatePrescriptionSchema = z.object({
  bookingId: z.number(),

  medicines: z.array(MedicineSchema).min(1, {
    message: "At least one medicine is required",
  }),

  dosageInstructions: z.string().optional(),
  notes: z.string().optional(),
});


export type CreatePrescriptionDTO = z.infer<typeof CreatePrescriptionSchema>;
export const UpdatePrescriptionSchema = z.object({
  medicines: z.array(MedicineSchema).min(1, {
    message: "At least one medicine is required",
  }).optional(),
});

export type UpdatePrescriptionDTO = Partial<CreatePrescriptionDTO>;