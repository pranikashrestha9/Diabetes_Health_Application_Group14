import multer from "multer";
import { Request } from "express";

import path from "path";
import { uniqueKey } from "../libs/hash";

export class MulterHelper {
  static diskStorage(path: string, moduleName: string) {
    return multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, `${path}`);
      },

      filename: (req: Request, file, cb) => {
        const extension = file.originalname.split(".").pop();
        cb(null, `${moduleName}-${file.originalname.split(".")[0]}-${uniqueKey()}.${extension}`);
      },
    });
  }

  static getStorage(
    path: string,
    options: {
      limits?: {
        fileSize?: number;
      };
      isFile?: boolean;
      moduleName: string;
    } = { limits: { fileSize: 5 * 1024 * 1024 }, moduleName: "default" },
  ) {
    return multer({
      storage: this.diskStorage(path, options.moduleName),
      limits: options.limits,
      fileFilter: this.fileFilter({ isFile: options.isFile! }),
    });
  }

static fileFilter(option: { isFile: boolean } = { isFile: true }) {
  return (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) => {
    const fileTypes = option.isFile
      ? /docx|pdf|csv/
      : /png|svg|webp|jpeg|jpg|gif/;

    const extension = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    // ✅ Proper MIME type validation
    const allowedMimeTypes = option.isFile
      ? [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
          "text/csv",
        ]
      : [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
          "image/svg+xml",
          "image/gif",
        ];

    const mimeType = allowedMimeTypes.includes(file.mimetype);

    if (extension && mimeType) {
      cb(null, true);
    } else {
      cb(
        new Error(
          option.isFile
            ? `Invalid file type: ${file.mimetype}. Allowed: docx, pdf, csv`
            : `Invalid image type: ${file.mimetype}. Allowed: png, svg, webp, jpeg, jpg`,
        ),
      );
    }
  };
}

  static isArray(
    files:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[],
  ): files is Express.Multer.File[] {
    return Array.isArray(files);
  }
  static isObject(
    files:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[],
  ): files is {
    [fieldname: string]: Express.Multer.File[];
  } {
    return Array.isArray(Object.values(files));
  }
}
