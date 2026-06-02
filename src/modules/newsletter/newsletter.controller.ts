import { NewsletterInput } from "./newsletter.schema";
import { Request, Response, NextFunction } from "express";
import { newsletterService } from "./newsletter.service";
import { messageFormater } from "../../libs/messageFormater";

export const newsletterController = {
  insertNewsletter: async (
    req: Request<NewsletterInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;
      const response = await newsletterService.saveNewsletter(email);
      res
        .status(201)
        .json(
          messageFormater(true, "Newsletter subscribed successfully", response),
        );
    } catch (error) {
      next(error);
    }
  },
};
