import { Router } from "express";
import ZOD from "../../middlewares/schemaValidator";
import { newsletterController } from "./newsletter.controller";
import { newsletterSchema } from "./newsletter.schema";

export const newsRouter = (router: Router) => {
  router.post(
    "/newsletter",

    ZOD.requestParser({
      schema: newsletterSchema,
      type: "Body",
    }),
    newsletterController.insertNewsletter,
  );
};
