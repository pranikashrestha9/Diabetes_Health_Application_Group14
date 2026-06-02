// helpers/multer-helper-s3-v3.ts
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { uniqueKey } from "../libs/hash";

interface S3Options {
  bucket: string;
  region: string;
  moduleName: string;
  limits?: { fileSize?: number };
  isFile?: boolean;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export class MulterHelperS3v3 {
  static fileFilter(option: { isFile: boolean } = { isFile: false }) {
    return (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      const fileTypes = option.isFile
        ? /docx|pdf|csv/
        : /png|svg|webp|jpeg|jpg|gif/;
      const extension = fileTypes.test(file.originalname.split(".").pop()!.toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
      if (extension && mimeType) cb(null, true);
      else cb(new Error(option.isFile ? "Invalid file type" : "Invalid image type"));
    };
  }

  static getStorage(options: S3Options) {
    return multer({
      limits: options.limits,
      fileFilter: MulterHelperS3v3.fileFilter({ isFile: options.isFile || false }),
      storage: multer.memoryStorage(), // store in memory first
    });
  }

  static async uploadFile(file: Express.Multer.File, options: S3Options) {
    const extension = file.originalname.split(".").pop();
    const Key = `${options.moduleName}-${uniqueKey()}.${extension}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: options.bucket,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      },
    });

    await upload.done();
    return `https://${options.bucket}.s3.${options.region}.amazonaws.com/${Key}`;
  }
}