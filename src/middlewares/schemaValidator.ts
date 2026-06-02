import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export default class ZOD {
  static requestParser =
    (
      ...args: {
        schema: ZodTypeAny;
        type: "Params" | "Body" | "Query";
        isFile?: boolean;
      }[]
    ) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        for (const item of args) {
          let response;

          if (item.type === "Body") {
            response = await item.schema.safeParseAsync(req.body);
          } else if (item.type === "Params") {
            response = await item.schema.safeParseAsync(req.params);
          } else if (item.type === "Query") {
            response = await item.schema.safeParseAsync(req.query);
          }

          if (!response?.success) {
            res.status(400).json({
              success: false,
              errors: response?.error?.issues || "Validation error",
            });
            return; // ✅ STOP EXECUTION (no next)
          }

          if (item.type === "Body") req.body = response.data;
          if (item.type === "Params")
            req.params = response.data as Request["params"];
          if (item.type === "Query")
            req.query = response.data as Request["query"];
        }

        next();
      } catch (error) {
        next(error);
      }
    };
}
