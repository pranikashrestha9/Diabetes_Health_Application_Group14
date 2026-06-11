import { Router } from "express";
import { PayoutController } from "./payout.controller";
import { validateToken } from "../../auth/validateToken";
import ZOD from "../../middlewares/schemaValidator";
import { UserIdSchema } from "../user/user.schema";

export const payoutRoutes = (router: Router) => {
  // 🔐 Create Payout (Admin / Manager)
  router.post(
    "/payout/:userId",
    validateToken({ checkInternalManager: true }),
    ZOD.requestParser({
      schema: UserIdSchema,
      type: "Params",
    }),
    PayoutController.createPayout,
  );
};
