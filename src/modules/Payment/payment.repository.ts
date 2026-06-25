import { In } from "typeorm";
import { Runner } from "../../global/global";
import { Payment, PaymentStatus } from "../../model/Payment";

export const PaymentRepository = {
  create: async ({
    runner,
    booking,
    amount,
  }: Runner & {
    booking: any;
    amount: number;
  }) => {
    const repo = runner.manager.getRepository(Payment);

    try {
      const payment = repo.create({
        booking,
        amount,
        status: PaymentStatus.PAID, // since you're simulating payment
        transactionId: "TXN" + Date.now(),
        paidAt: new Date(),
      });

      return await repo.save(payment);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  getDoctorFinanceDetails: async ({
    runner,
    doctorUserId,
  }: Runner & { doctorUserId: number }) => {
    const repo = runner.manager.getRepository(Payment);

    try {
      const payments = await repo.find({
        relations: ["booking", "booking.doctor", "booking.doctor.user"],
        where: {
          booking: {
            doctor: {
              user: {
                userId: doctorUserId,
              },
            },
          },
          status: "PAID",
        },
      });

      if (!payments.length) return null;

      const doctor = payments[0].booking.doctor;

      let totalRevenue = 0;
      let totalPlatformCut = 0;
      let totalDoctorEarning = 0;

      // 🧾 Booking-wise data
      const bookings = payments.map((p: Payment) => {
        const platformCut = p.amount * 0.2;
        const doctorEarning = p.amount * 0.8;

        totalRevenue += p.amount;
        totalPlatformCut += platformCut;
        totalDoctorEarning += doctorEarning;

        return {
          bookingId: p.booking.id,
          date: p.booking.bookingDate,
          status: p.booking.status,
          paymentStatus: p.status,
          amount: p.amount,
          platformCut,
          doctorEarning,
        };
      });

      // 💳 Raw payment data (NEW)
      const paymentData = payments.map((p: Payment) => ({
        paymentId: p.paymentId,
        bookingId: p.booking.id,
        amount: p.amount,
        status: p.status,
        transactionId: p.transactionId,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
      }));

      return {
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee,

        summary: {
          totalBookings: payments.length,
          totalRevenue,
          platformCut: totalPlatformCut,
          doctorEarning: totalDoctorEarning,
        },

        bookings,

        // ✅ ADD THIS
        payments: paymentData,
      };
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findPaidByIdsAndDoctor: async ({
    runner,
    paymentIds,
    doctorId,
  }: Runner & {
    paymentIds: number[];
    doctorId: number;
  }) => {
    try {
      return await runner.manager.getRepository(Payment).find({
        where: {
          paymentId: In(paymentIds),
          status: "PAID",
          booking: {
            doctor: {
              id: doctorId,
            },
          },
        },
        relations: ["booking", "booking.doctor"],
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findPaidByDoctor: async ({
    runner,
    doctorId,
  }: Runner & { doctorId: number }) => {
    return await runner.manager.getRepository(Payment).find({
      relations: ["booking", "booking.doctor", "booking.doctor.user"],
      where: {
        status: "PAID",
        booking: {
          doctor: {
            id: doctorId,
          },
        },
      },
    });
  },

  setPaymentStatus: async ({
    runner,
    payment,
    status,
  }: Runner & { payment: Payment; status: PaymentStatus }) => {
    try {
      const repo = runner.manager.getRepository(Payment);
      payment.status = status;
      return await repo.save(payment);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  getPaymentByBookingId: async ({
    runner,
    bookingId,
  }: Runner & { bookingId: number }) => {
    try {
      return await runner.manager.getRepository(Payment).findOne({
        where: {
          booking: {
            id: bookingId,
          },
        },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
}; 
