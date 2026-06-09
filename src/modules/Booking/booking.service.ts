import { Exception } from "../../libs/exceptionHandler";
import { MeetLinkGenerator } from "../../libs/linkGenerator";
import { mailService } from "../../libs/mailService";
import ORMHelper from "../../libs/ORMHelper";
import { DoctorRepository } from "../Doctor/doctorData.repository";
import { UserRepository } from "../user/user.repository";
import { BookingRepository } from "./booking.repository";
import { CreateBookingDTO } from "./booking.schema";

export const BookingService = {
  createBooking: async ({
    userPatientId,
    bookingData,
  }: {
    userPatientId: number;
    bookingData: CreateBookingDTO;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      // ✅ 1. Get patient
      const patient = await UserRepository.findById({
        runner,
        userId: userPatientId,
      });

      if (patient.role !== "PATIENT") {
        throw new Exception("Only patients can book", 400);
      }

      // ✅ 2. Check doctor exists
      const doctor = await DoctorRepository.getDoctorByDoctorId({
        runner,
        doctorId: bookingData.doctorId,
      });

      if (!doctor) {
        throw new Exception("Doctor not found", 404);
      }

      // ✅ 3. Check time conflict
      const conflict = await BookingRepository.findConflict({
        runner,
        doctorIda: doctor.id,
        ...bookingData,
      });

      if (conflict) {
        throw new Exception("Time slot already booked", 400);
      }

      // ✅ 4. Create booking
      const booking = await BookingRepository.create({
        runner,
        data: {
          ...bookingData,
          patient,
          doctor,
        },
      });

      await ORMHelper.commitTransaction(runner);

      return booking;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  approveBooking: async (bookingId: number) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      const booking = await BookingRepository.findById({
        runner,
        id: bookingId,
      });

      if (!booking) {
        throw new Exception("Booking not found", 404);
      }

      if (booking.status !== "PENDING") {
        throw new Exception("Booking already processed", 400);
      }

      // ✅ generate meet link
      const meetLink = MeetLinkGenerator.generate();

      // ✅ update status
      booking.status = "CONFIRMED";
      booking.meetLink = meetLink;

      await BookingRepository.updateStatus({
        runner,
        booking,
        status: "CONFIRMED",
      });

      // ✅ send email
      await mailService.sendBookingConfirmation({
        patientEmail: booking.patient.email,
        patientName: booking.patient.firstName,
        doctorName: booking.doctor.user.firstName,
        date: booking.bookingDate,
        time: `${booking.startTime} - ${booking.endTime}`,
        meetLink,
      });

      await ORMHelper.commitTransaction(runner);

      return booking;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  denyBooking: async (bookingId: number) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      const booking = await BookingRepository.findById({
        runner,
        id: bookingId,
      });

      if (!booking) {
        throw new Exception("Booking not found", 404);
      }

      if (booking.status !== "PENDING") {
        throw new Exception("Booking already processed", 400);
      }

      booking.status = "CANCELLED";

      await BookingRepository.updateStatus({
        runner,
        booking,
        status: "CANCELLED",
      });

      await mailService.sendBookingCancellation({
        patientEmail: booking.patient.email,
        patientName: booking.patient.firstName,
        doctorName: booking.doctor.user.firstName,
        date: booking.bookingDate,
        time: `${booking.startTime} - ${booking.endTime}`,
        reason: "Doctor unavailable", // optional
      });

      await ORMHelper.commitTransaction(runner);

      return booking;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getMyBookings: async ({ userId, role }: { userId: number; role: string }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      if (role === "PATIENT") {
        return await BookingRepository.findByPatientId({ runner, userId });
      }

      if (role === "DOCTOR") {
        return await BookingRepository.findByDoctorUserId({ runner, userId });
      }

      throw new Exception("Unauthorized", 403);
    } finally {
      ORMHelper.release(runner);
    }
  },
};
