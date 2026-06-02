import NodeMailer from "../../libs/nodeMailer";
import { generateOPT } from "../../libs/OPTGenerator";
import jwt from "jsonwebtoken";
import { environment } from "../../config/env.config";
import { Exception } from "../../libs/exceptionHandler";

export const OTPService = {
  sendOTP: async ({ email }: { email: string }) => {
    try {
      const otp = generateOPT();

      // ✅ create token (store otp + email)
      const token = jwt.sign(
        {
          email,
          otp,
        },
        environment.SECRET_KEY!,
        { expiresIn: "5m" }, // ⏱️ expiry
      );

      // ✅ send email
      await NodeMailer.send({
        to: email,
        subject: "Your OTP Code",
        body: `<p>Your OTP code is: <strong>${otp}</strong></p>
               <p>This code will expire in 5 minutes.</p>`,
      });

      return token; // ⭐ return token instead of saving in DB
    } catch (error) {
      console.error("OTP ERROR:", error);
      throw error;
    }
  },

  verifyOTP: async ({ token, otp }: { token: string; otp: string }) => {
    try {
      if (!token) {
        throw new Exception("Token is required for OTP verification", 400);
      }

      const decoded: any = jwt.verify(token, environment.SECRET_KEY!);

      if (String(decoded.otp).trim() !== String(otp).trim()) {
        throw new Exception("Invalid OTP", 400);
      }

      return {
        success: true,
        email: decoded.email,
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      throw new Exception("Invalid or expired OTP", 400);
    }
  },
};
