import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { generatePDF } from "../../libs/pdfGenerator";
import { generatePrescriptionHTML } from "../../libs/template/prescriptionTemplate";
import { BookingRepository } from "../Booking/booking.repository";
import { PrescriptionRepository } from "./prescription.repository";
import { UpdatePrescriptionDTO } from "./prescription.schema";

export const PrescriptionService = {
  // ✅ CREATE
  createPrescription: async ({
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

      const existing = await PrescriptionRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (existing) {
        throw new Exception("Prescription already exists", 400);
      }

      const prescription = await PrescriptionRepository.create({
        runner,
        data: {
          ...data,
          booking,
        },
      });

      await ORMHelper.commitTransaction(runner);
      return prescription;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  // ✅ GET
  getPrescription: async ({
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
      const prescription = await PrescriptionRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (!prescription) {
        throw new Exception("Prescription not found", 404);
      }

      const booking = prescription.booking;

      // 🔐 Access control
      if (role === "PATIENT" && booking.patient.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      if (role === "DOCTOR" && booking.doctor.user.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      return prescription;
    } finally {
      ORMHelper.release(runner);
    }
  },

  // ✅ UPDATE
  updatePrescription: async ({
    doctorUserId,
    bookingId,
    data,
  }: {
    doctorUserId: number;
    bookingId: number;
    data: UpdatePrescriptionDTO;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await ORMHelper.createTransaction(runner);

      const prescription = await PrescriptionRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (!prescription) {
        throw new Exception("Prescription not found", 404);
      }

      // 🔐 Only doctor can update
      if (prescription.booking.doctor.user.userId !== doctorUserId) {
        throw new Exception("Unauthorized", 403);
      }

      const updated = await PrescriptionRepository.update({
        runner,
        prescription,
        data,
      });

      await ORMHelper.commitTransaction(runner);

      return updated;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  generatePrescriptionPDF: async ({
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
      // ✅ Get prescription
      const prescription = await PrescriptionRepository.findByBookingId({
        runner,
        bookingId,
      });

      if (!prescription) {
        throw new Exception("Prescription not found", 404);
      }

      const booking = prescription.booking;

      // 🔐 ACCESS CONTROL
      if (role === "PATIENT" && booking.patient.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      if (role === "DOCTOR" && booking.doctor.user.userId !== userId) {
        throw new Exception("Unauthorized", 403);
      }

      // ✅ Generate HTML
      const html = generatePrescriptionHTML({
        patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
        doctorName: `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}`,
        date: booking.bookingDate,
        medicines: prescription.medicines,
        dosageInstructions: prescription.dosageInstructions,
        notes: prescription.notes,
      });

      // ✅ Convert to PDF
      const pdfBuffer = await generatePDF(html);

      return pdfBuffer;
    } finally {
      ORMHelper.release(runner);
    }
  },
};
