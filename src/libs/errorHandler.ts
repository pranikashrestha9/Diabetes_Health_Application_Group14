import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";
import unsync, { unsyncFromPublic } from "./unsync";

export const errorHandler = () => {
  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    // Clean up uploaded files if any
    if (req.file) {
      unsync(req.file.path);
    }
    if (req.file?.filename) {
      unsyncFromPublic(req.file.filename);
    }
    if (req.files) {
      const files = req.files;

      if (Array.isArray(files)) {
        files.forEach((item) => {
          unsync(item.path);
        });
      } else {
        for (const key in files) {
          if (Object.prototype.hasOwnProperty.call(files, key)) {
            const elements = files[key];
            if (Array.isArray(elements)) {
              elements.forEach((item) => {
                unsync(item.path);
              });
            }
          }
        }
      }
    }

    // Prevent sending response if already sent
    if (res.headersSent) {
      next(err);
    } else {
      // Set defaults
      err.statusCode = err.statusCode || 500;
      err.status = err.status || "error";

      // Multer error
      if (err instanceof MulterError) {
        let message;
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            message = "File size exceeds the allowed limit.";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            message = "Too many files uploaded or unexpected file field.";
            break;
          case "LIMIT_PART_COUNT":
            message = "Too many parts in the multipart request.";
            break;
          case "LIMIT_FIELD_KEY":
            message = "Field name too long.";
            break;
          default:
            message = "Multer error occurred.";
        }
        res.status(400).json({ status: "fail", message });
      }

      // Zod validation error
      else if (err instanceof ZodError) {
        res
          .status(400)
          .json({
            status: "fail",
            message: "Validation error",
            details: err.issues,
          });
      }

      // DB error
      else if (err.level === "DB") {
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" ,stack: err.stack})
          
      }

      // All other errors
      else {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message || "Something went wrong",
          stack: err.stack,
        });
      }
    }
  };
};
