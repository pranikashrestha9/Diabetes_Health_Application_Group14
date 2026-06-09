import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import ZOD from "../../middlewares/schemaValidator";
import { bookingIdSchema } from "../Booking/booking.schema";
import { CreateRecommendationSchema } from "./recommendation.schema";
import { RecommendationController } from "./recommendation.controller";

export const RecommendationRoutes = (router: Router) => {
  router.post(
    "/recommendation/:bookingId",
    validateToken({ checkDoctor: true }),
    ZOD.requestParser(
      {
        schema: CreateRecommendationSchema,
        type: "Body",
      },
      {
        schema: bookingIdSchema,
        type: "Params",
      },
    ),
    //(req) => console.log("hello", req.body),

    RecommendationController.add,
  );

  //   router.patch(
  //     "/recommendation/:bookingId",
  //     validateToken({ checkDoctor: true }),
  //     ZOD.requestParser(
  //       {
  //         schema: UpdateRecommendationSchema,
  //         type: "Body",
  //       },
  //       {
  //         schema: bookingIdSchema,
  //         type: "Params",
  //       },
  //     ),
  //     RecommendationController.updateRecommendation,
  //   );

  router.get(
    "/recommendation/:bookingId",
    validateToken({ checkDoctor: true, checkPatient: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    RecommendationController.getRecommendationByBookingId,
  );

  router.get(
    "/recommendation/:bookingId/download",
    validateToken({ checkDoctor: true, checkPatient: true }),
    ZOD.requestParser({
      schema: bookingIdSchema,
      type: "Params",
    }),
    RecommendationController.downloadRecommendation,
  );
};
