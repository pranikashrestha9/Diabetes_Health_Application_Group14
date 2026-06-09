import NodeMailer from "./nodeMailer";

export const mailService = {
  // ✅ Booking Confirmation Mail
  sendBookingConfirmation: async ({
    patientEmail,
    patientName,
    doctorName,
    date,
    time,
    meetLink,
  }: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    meetLink: string;
  }) => {
    try {
      const subject = `Appointment Confirmed with Dr. ${doctorName}`;

      const body = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Appointment Confirmation</h2>

          <p>Dear <strong>${patientName}</strong>,</p>

          <p>Your appointment has been successfully scheduled.</p>

          <hr />

          <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>

          <p><strong>Meeting Link:</strong></p>
          <a href="${meetLink}" target="_blank">${meetLink}</a>

          <hr />

          <p>Please join the meeting on time.</p>

          <p>Thank you,<br/>Healthcare Team</p>
        </div>
      `;

      await NodeMailer.send({
        to: patientEmail,
        subject,
        body,
      });

      return true;
    } catch (error) {
      console.error("BOOKING MAIL ERROR:", error);
      throw error;
    }
  },

  // ❌ Booking Cancellation Mail
sendBookingCancellation: async ({
  patientEmail,
  patientName,
  doctorName,
  date,
  time,
  reason,
}: {
  patientEmail: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason?: string;
}) => {
  try {
    const subject = `Appointment Cancelled with Dr. ${doctorName}`;

    const body = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">Appointment Cancelled</h2>

        <p>Dear <strong>${patientName}</strong>,</p>

        <p>We regret to inform you that your appointment has been cancelled.</p>

        <hr />

        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>

        ${
          reason
            ? `<p><strong>Reason:</strong> ${reason}</p>`
            : ""
        }

        <hr />

        <p>Please feel free to reschedule at your convenience.</p>

        <p>We apologize for any inconvenience caused.</p>

        <p>Thank you,<br/>Healthcare Team</p>
      </div>
    `;

    await NodeMailer.send({
      to: patientEmail,
      subject,
      body,
    });

    return true;
  } catch (error) {
    console.error("CANCELLATION MAIL ERROR:", error);
    throw error;
  }
},
};