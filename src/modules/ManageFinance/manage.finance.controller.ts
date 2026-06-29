


// export const ManagerFinanceController = {
//   getSummary: async (req:Request, res:Response, next:NextFunction) => {
//     try {
//       const doctorId = Number(req.params.doctorId);

//       const data = await ManagerFinanceService.getSummary(doctorId);

//       res.json({
//         success: true,
//         data,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },

//   getPaymentHistory: async (req, res, next) => {
//     try {
//       const doctorId = Number(req.params.doctorId);

//       const data =
//         await ManagerFinanceService.getPaymentHistory(doctorId);

//       res.json({ success: true, data });
//     } catch (err) {
//       next(err);
//     }
//   },

//   getPayoutHistory: async (req, res, next) => {
//     try {
//       const doctorId = Number(req.params.doctorId);

//       const data =
//         await ManagerFinanceService.getPayoutHistory(doctorId);

//       res.json({ success: true, data });
//     } catch (err) {
//       next(err);
//     }
//   },
// };