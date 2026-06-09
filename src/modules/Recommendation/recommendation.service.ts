import ORMHelper from "../../libs/ORMHelper";
import { Exception } from "../../libs/exceptionHandler";
import { generatePDF } from "../../libs/pdfGenerator";
import { generateRecommendationHTML } from "../../libs/template/recommendationTemplate";
import { BookingRepository } from "../Booking/booking.repository";
import { RecommendationRepository } from "./recommendation.repository";

export const RecommendationService = {
  add: async ({
    doctorUserId,
    bookingId,
    data,
  }: {
    doctorUserId: number;
    bookingId: number;
    data: any;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      const booking = await BookingRepository.findById({
        runner,
        id: bookingId,
      });

      if (!booking) throw new Exception("Booking not found", 404);

      // 🔐 Only doctor can add
      if (booking.doctor.user.userId !== doctorUserId) {
        throw new Exception("Unauthorized", 403);
      }

      if (booking.status !== "CONFIRMED") {
        throw new Exception(
          "Prescription allowed only after confirmation",
          400,
        );
      }

      const existing = await RecommendationRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (existing) {
        throw new Exception("Prescription already exists", 400);
      }

      const recommendation = await RecommendationRepository.create({
        runner,
        data: {
          ...data,
          booking,
        },
      });

      await ORMHelper.commitTransaction(runner);
      return recommendation;
    } catch (err) {
      await ORMHelper.rollBackTransaction(runner);
      throw err;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getRecommendationByBookingId: async (bookingId: number) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const data = await RecommendationRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (!data) throw new Exception("Not found", 404);

      return data;
    } finally {
      ORMHelper.release(runner);
    }
  },

  update: async (id: number, data: any) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const updated = await RecommendationRepository.update({
        runner,
        id,
        data,
      });

      return updated;
    } finally {
      ORMHelper.release(runner);
    }
  },

  generateRecommendationPDF: async ({
    userId,
    role,
    bookingId,
  }: {
    userId: number;
    role: string;
    bookingId: number;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      // ✅ Get recommendation
      const recommendation = await RecommendationRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (!recommendation) {
        throw new Exception("Recommendation not found", 404);
      }

      const booking = recommendation.booking;

      // 🔐 ACCESS CONTROL
      if (role === "PATIENT" && booking.patient.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      if (role === "DOCTOR" && booking.doctor.user.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      // ✅ Generate HTML
      const html = generateRecommendationHTML({
        patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
        doctorName: `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}`,
        date: booking.bookingDate,
        advice: recommendation.advice,
        dietPlan: recommendation.dietPlan,
        lifestyleChanges: recommendation.lifestyleChanges,
      });

      // ✅ Convert HTML → PDF
      const pdfBuffer = await generatePDF(html);

      return pdfBuffer;
    } finally {
      ORMHelper.release(runner);
    }
  },
};
