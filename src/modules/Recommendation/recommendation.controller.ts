import { Request, Response, NextFunction } from "express";
import { RecommendationService } from "./recommendation.service";
import { messageFormater } from "../../libs/messageFormater";
import { BookingIdDTO } from "../Booking/booking.schema";

export const RecommendationController = {
  add: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const doctorUserId = req.tokenPayload.userId;
      const bookingId = Number(req.params.bookingId);

      const response = await RecommendationService.add({
        doctorUserId,
        bookingId,
        data: req.body,
      });

      res
        .status(201)
        .json(messageFormater(true, "Recommendation created", response, 201));
    } catch (err) {
      next(err);
    }
  },

  getRecommendationByBookingId: async (
    req: Request<BookingIdDTO, {}, {}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const bookingId = Number(req.params.bookingId);

      const response =
        await RecommendationService.getRecommendationByBookingId(bookingId);

      res
        .status(200)
        .json(messageFormater(true, "Recommendation fetched", response, 200));
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      const response = await RecommendationService.update(id, req.body);

      res.status(200).json(messageFormater(true, "Updated", response, 200));
    } catch (err) {
      next(err);
    }
  },


  downloadRecommendation: async (
      req: Request<BookingIdDTO, {}, {}>,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const userId = req.tokenPayload.userId;
        const role = req.tokenPayload.role;
        const bookingId = Number(req.params.bookingId);
  
        const pdf = await RecommendationService.generateRecommendationPDF({
          userId,
          role,
          bookingId,
        });
  
     
      if (!pdf) {
        throw new Error("PDF not generated");
      }
  
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=recommendation-${bookingId}.pdf`,
        "Content-Length": pdf.length,
      });
  
      res.end(pdf);
      } catch (error) {
        next(error);
      }
    },
};
