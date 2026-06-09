import { PrescriptionService } from "./prescription.service";
import { messageFormater } from "../../libs/messageFormater";

import { Request, Response, NextFunction } from "express";
import { UpdatePrescriptionDTO } from "./prescription.schema";
import { BookingIdDTO } from "../Booking/booking.schema";

export const PrescriptionController = {
  createPrescription: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const doctorUserId = req.tokenPayload.userId;
      const bookingId = Number(req.params.bookingId);

      const response = await PrescriptionService.createPrescription({
        doctorUserId,
        bookingId,
        data: req.body,
      });

      res
        .status(201)
        .json(messageFormater(true, response, "Prescription created", 201));
    } catch (error) {
      next(error);
    }
  },

  // 📥 GET
  getPrescription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.tokenPayload.userId;
      const role = req.tokenPayload.role;
      const bookingId = Number(req.params.bookingId);

      const response = await PrescriptionService.getPrescription({
        userId,
        role,
        bookingId,
      });

      res
        .status(200)
        .json(messageFormater(true, response, "Prescription fetched", 200));
    } catch (error) {
      next(error);
    }
  },

  // ✏ UPDATE
  updatePrescription: async (
    req: Request<BookingIdDTO, {}, UpdatePrescriptionDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const doctorUserId = req.tokenPayload.userId;
      const bookingId = Number(req.params.bookingId);

      const response = await PrescriptionService.updatePrescription({
        doctorUserId,
        bookingId,
        data: req.body,
      });

      res
        .status(200)
        .json(messageFormater(true, response, "Prescription updated", 200));
    } catch (error) {
      next(error);
    }
  },

  getPrescriptionByBookingId: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.tokenPayload.userId;
      const role = req.tokenPayload.role;
      const bookingId = Number(req.params.bookingId);

      const response = await PrescriptionService.getPrescription({
        userId,
        role,
        bookingId,
      });

      res
        .status(200)
        .json(messageFormater(true, response, "Prescription fetched", 200));
    } catch (error) {
      next(error);
    }
  },

  downloadPrescription: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.tokenPayload.userId;
      const role = req.tokenPayload.role;
      const bookingId = Number(req.params.bookingId);

      const pdf = await PrescriptionService.generatePrescriptionPDF({
        userId,
        role,
        bookingId,
      });

   
    if (!pdf) {
      throw new Error("PDF not generated");
    }

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=prescription-${bookingId}.pdf`,
      "Content-Length": pdf.length,
    });

    res.end(pdf);
    } catch (error) {
      next(error);
    }
  },
};
