import { z } from "zod";

export const CreateBookingSchema = z
  .object({
    doctorId: z.number(),
    bookingDate: z.string(), // YYYY-MM-DD

    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

    notes: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be greater than start time",
    path: ["endTime"],
  });

export const bookingIdSchema = z.object({
  bookingId: z.string(),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;

export type BookingIdDTO = z.infer<typeof bookingIdSchema>;
