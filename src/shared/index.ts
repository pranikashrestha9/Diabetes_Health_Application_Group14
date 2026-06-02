import { application, Express, Router } from "express";
import { otpRoutes } from "../modules/OTP/otp.routes";
import { newsRouter } from "../modules/newsletter/newsletter.routes";
import { patientRoutes } from "../modules/patient/patient.routes";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../auth/auth.routes";

export const router = (app: Express) => {
  const router = Router();

  patientRoutes(router);
  userRoutes(router);
   authRoutes(router);
  otpRoutes(router);
  newsRouter(router);
  app.use("/api/v1/", router);
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
  });
};
