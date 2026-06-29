import { Request,Response,NextFunction } from "express";
import { ManageFinanceService } from "./manage.finance.service";



export const ManageFinanceController = {
  getSummary: async (req:Request, res:Response, next:NextFunction) => {
    try {
      const doctorId = Number(req.params.doctorId);

      const data = await ManageFinanceService.getSummary(doctorId);

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getPaymentHistory: async (req:Request, res:Response, next:NextFunction) => {
    try {
      const doctorId = Number(req.params.doctorId);

      const data =
        await ManageFinanceService.getPaymentHistory(doctorId);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getPayoutHistory: async (req:Request, res:Response, next:NextFunction) => {
    try {
      const doctorId = Number(req.params.doctorId);

      const data =
        await ManageFinanceService.getPayoutHistory(doctorId);

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};