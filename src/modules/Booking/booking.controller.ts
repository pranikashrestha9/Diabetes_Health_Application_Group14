import { NextFunction, Response, Request } from "express";
import { messageFormater } from "../../libs/messageFormater";
import { BookingService } from "./booking.service";
import { BookingIdDTO, CreateBookingDTO } from "./booking.schema";
import { formatBookingResponse } from "../../libs/ResponseFormat/bookingResponseFormat";
import { DoctorIdParamType } from "../Doctor/doctorData.schema";

export const BookingController = {
  createBooking: async (
    req: Request<DoctorIdParamType, {}, CreateBookingDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.tokenPayload.userId;
      const doctorId = Number(req.params.doctorId);

      if (isNaN(doctorId)) {
        throw new Error("Invalid doctor id");
      }
      const userPatientId = Number(id);

      const response = await BookingService.createBooking({
        userPatientId,
        doctorId,
        bookingData: req.body,
      });

      const cleanResponse = formatBookingResponse(response);

      res
        .status(201)
        .json(
          messageFormater(
            true,
            "Booking created successfully",
            cleanResponse,
            201,
          ),
        );
    } catch (error) {
      next(error);
    }
  },

  approveBooking: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.bookingId);

      if (isNaN(id)) {
        throw new Error("Invalid booking id");
      }

      const response = await BookingService.approveBooking(id);

      const cleanResponse = formatBookingResponse(response);

      res
        .status(200)
        .json(messageFormater(true, "Booking approved", cleanResponse, 200));
    } catch (error) {
      next(error);
    }
  },

  denyBooking: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.bookingId);

      if (isNaN(id)) {
        throw new Error("Invalid booking id");
      }

      const response = await BookingService.denyBooking(id);

         
      res
        .status(200)
        .json(messageFormater(true, "Booking cancelled", response, 200));
    } catch (error) {
      next(error);
    }
  },

  getMyBookings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.tokenPayload.userId;
      const role = req.tokenPayload.role;

      const bookings = await BookingService.getMyBookings({
        userId,
        role,
      });

      const clean = bookings.map(formatBookingResponse);

      res
        .status(200)
        .json(messageFormater(true, clean, "Bookings retrieved", 200));
    } catch (error) {
      next(error);
    }
  },
};
