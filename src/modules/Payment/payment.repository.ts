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

  findByDoctorId: async ({
  runner,
  doctorId,
}: Runner & { doctorId: number }) => {
  const repo = runner.manager.getRepository(Payment);

  return await repo.find({
    where: {
      booking: {
        doctor: {
          id: doctorId, // ✅ direct doctor.id
        },
      },
    },
    relations: [
      "booking",
      "booking.doctor",
    ],
    order: {
      createdAt: "DESC",
    },
  });
}

  //   getDoctorFinanceDetails: async ({
  //     runner,
  //     doctorUserId,
  //   }: Runner & { doctorUserId: number }) => {
  //     const repo = runner.manager.getRepository(Payment);

  //     try {
  //       const payments = await repo.find({
  //         relations: ["booking", "booking.doctor", "booking.doctor.user"],
  //         where: {
  //           booking: {
  //             doctor: {
  //               user: {
  //                 userId: doctorUserId,
  //               },
  //             },
  //             status: "CONFIRMED", // ✅ IMPORTANT
  //           },
  //           status: "PAID",
  //           isSettled: false,
  //         },
  //       });

  //       if (!payments.length) return null;

  //       const doctor = payments[0].booking.doctor;

  //       let totalRevenue = 0;
  //       let totalPlatformCut = 0;
  //       let totalDoctorEarning = 0;

  //       const bookings = payments.map((p: Payment) => {
  //         const platformCut = p.amount * 0.2;
  //         const doctorEarning = p.amount * 0.8;

  //         totalRevenue += p.amount;
  //         totalPlatformCut += platformCut;
  //         totalDoctorEarning += doctorEarning;

  //         return {
  //           bookingId: p.booking.id,
  //           date: p.booking.bookingDate,
  //           status: p.booking.status,
  //           paymentStatus: p.status,
  //           isSettled: p.isSettled, // ✅ NEW
  //           amount: p.amount,
  //           platformCut,
  //           doctorEarning,
  //         };
  //       });

  //       const paymentData = payments.map((p: Payment) => ({
  //         paymentId: p.paymentId,
  //         bookingId: p.booking.id,
  //         amount: p.amount,
  //         status: p.status,
  //         isSettled: p.isSettled, // ✅ NEW
  //         transactionId: p.transactionId,
  //         paidAt: p.paidAt,
  //         createdAt: p.createdAt,
  //       }));

  //       return {
  //         doctorId: doctor.id,
  //         totalRevenue,
  //         totalPlatformCut,
  //         totalDoctorEarning,
  //         bookings,
  //         paymentData,
  //       };
  //     } catch (error: any) {
  //       error.level = "DB";
  //       throw error;
  //     }
  //   },
,
  getDoctorFinanceDetails: async ({
    runner,
    doctorUserId,
    settled,
  }: Runner & { doctorUserId: number; settled?: string }) => {
    const repo = runner.manager.getRepository(Payment);

    const whereCondition: any = {
      booking: {
        doctor: {
          user: {
            userId: doctorUserId,
          },
        },
        status: "CONFIRMED",
      },
      status: "PAID",
    };

    // 🔥 Dynamic filter
    if (settled !== undefined) {
      whereCondition.isSettled = settled === "true";
    }

    const payments = await repo.find({
      relations: ["booking", "booking.doctor", "booking.doctor.user"],
      where: whereCondition,
    });

    if (!payments.length) return null;

    const doctor = payments[0].booking.doctor;

    let totalRevenue = 0;
    let totalPlatformCut = 0;
    let totalDoctorEarning = 0;

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
        isSettled: p.isSettled,
        amount: p.amount,
        platformCut,
        doctorEarning,
      };
    });

    const paymentData = payments.map((p: Payment) => ({
      paymentId: p.paymentId,
      bookingId: p.booking.id,
      amount: p.amount,
      status: p.status,
      isSettled: p.isSettled,
      transactionId: p.transactionId,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    }));

    return {
      doctorId: doctor.id,
      totalRevenue,
      totalPlatformCut,
      totalDoctorEarning,
      bookings,
      paymentData,
    };
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

  //   findPaidByDoctor: async ({
  //     runner,
  //     doctorUserId,
  //   }: Runner & { doctorUserId: number }) => {
  //     try {
  //       const payments = await runner.manager
  //         .getRepository(Payment)
  //         .createQueryBuilder("payment")
  //         .leftJoinAndSelect("payment.booking", "booking")
  //         .leftJoinAndSelect("booking.doctor", "doctor")
  //         .leftJoinAndSelect("doctor.user", "user")
  //         .where("payment.status = :status", { status: "PAID" })
  //         .andWhere("(payment.isSettled = false OR payment.isSettled IS NULL)") // ✅ safe
  //         .andWhere("booking.status = :bookingStatus", {
  //           bookingStatus: "CONFIRMED",
  //         })
  //         .andWhere("user.userId = :doctorUserId", { doctorUserId }) // ✅ KEY FIX
  //         .getMany();

  //       // console.log("✅ FILTERED PAYMENTS:", payments);

  //       return payments;
  //     } catch (error: any) {
  //       error.level = "DB";
  //       console.error("❌ Error in findPaidByDoctor:", error);
  //       throw error;
  //     }
  //   },

  findPaidByDoctor: async ({
    runner,
    doctorUserId,
  }: Runner & { doctorUserId: number }) => {
    return await runner.manager.getRepository(Payment).find({
      where: {
        status: "PAID",
        isSettled: false, // ✅ THIS IS THE FIX
        booking: {
          doctor: {
            user: {
              userId: doctorUserId,
            },
          },
        },
      },
      relations: ["booking"],
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

  markAsSettled: async ({
    runner,
    paymentIds,
  }: Runner & { paymentIds: number[] }) => {
    try {
      await runner.manager
        .getRepository(Payment)
        .update({ paymentId: In(paymentIds) }, { isSettled: true });
    } catch (error: any) {
      error.level = "DB";
      console.error("❌ Error in markAsSettled:", error);
      throw error;
    }
  },
findDetailedByDoctor: async ({
  runner,
  doctorUserId,
}: Runner & { doctorUserId: number }) => {
  const repo = runner.manager.getRepository(Payment);

  return await repo.find({
    where: {
      booking: {
        doctor: {
          user: {
            userId: doctorUserId, // ✅ FIX HERE
          },
        },
      },
    },
    relations: [
      "booking",
      "booking.doctor",
      "booking.doctor.user", // ⚠️ important for nested filtering
    ],
    order: { createdAt: "DESC" },
  });
}
};
