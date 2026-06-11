import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import ZOD from "../../middlewares/schemaValidator";
import { BookingController } from "./booking.controller";
import { bookingIdSchema, CreateBookingSchema } from "./booking.schema";
import { DoctorIdParam } from "../Doctor/doctorData.schema";

export const bookingRouter = (router: Router) => {
  router.post(
    "/book-appointment/:doctorId",
    validateToken({ checkPatient: true }),

    ZOD.requestParser(
      {
        schema: CreateBookingSchema,
        type: "Body",
      },
      {
        schema: DoctorIdParam,
        type: "Params",
      },
    ),
    //(req) => console.log("hello", req.body),
    BookingController.createBooking,
  );

  router.get(
    "/bookings",
    validateToken({ checkDoctor: true, checkPatient: true }),
    BookingController.getMyBookings,
  );

  router.patch(
    "/approve-booking/:bookingId",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    BookingController.approveBooking,
  );

  router.patch(
    "/deny-booking/:bookingId",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    BookingController.denyBooking,
  );
};
