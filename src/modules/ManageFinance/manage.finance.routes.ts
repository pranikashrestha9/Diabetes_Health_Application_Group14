import { Router } from "express";
import { ManageFinanceController } from "./manage.finance.controller";
import { validateToken } from "../../auth/validateToken";

export const financeRoutes = (router: Router) => {
  router.get(
    "/finance/summary/:doctorId",
    validateToken({ checkInternalManager: true }),
    ManageFinanceController.getSummary,
  );

  router.get(
    "/finance/payment-history/:doctorId",
    validateToken({ checkInternalManager: true }),
    ManageFinanceController.getPaymentHistory,
  );

  router.get(
    "/finance/payout-history/:doctorId",
    validateToken({ checkInternalManager: true }),
    ManageFinanceController.getPayoutHistory,
  );
};
