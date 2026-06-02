import { Router } from "express";
import { authController } from "./authenticateUser";
import ZOD from "../middlewares/schemaValidator";
import { forgotPasswordSchema } from "./auth.schema";

export const authRoutes = (router: Router) => {
  router.post("/login", authController.login);
  router.post("/auth/refresh", authController.getAccessTokenWithRefreshToken);
  router.patch(
    "/forget-password",
    ZOD.requestParser({
      schema: forgotPasswordSchema,
      type: "Body",
    }),
    authController.forgetPassword,
  );
};
