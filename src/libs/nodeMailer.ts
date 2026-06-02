import { environment } from "../config/env.config";
import dotenv from "dotenv";
dotenv.config();
import nodemailer, { Transporter } from "nodemailer";
const { SMTP_HOST, SMTP_PORT, SMTP_PASS, SMTP_SENDER } = environment;
const mailTransporter: Transporter = nodemailer.createTransport({

  host: SMTP_HOST!,
  port: +(SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: SMTP_SENDER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default class NodeMailer {
  static async send({
    to,
    subject,
    body,
  }: {
    to?: string;
    subject: string;
    body: string;
  }): Promise<string> {
    try {
      const info = await mailTransporter.sendMail({
        from: SMTP_SENDER,
        to,
        subject,
        html: body,
      });

      return info.messageId;
    } catch (error: any) {
      error.level = "Critical";
      throw new Error(error.message);
    }
  }
}
