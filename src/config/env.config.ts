import * as dotenv from "dotenv";
dotenv.config();

export const environment = {
  //server
  SERVER_PORT: +process.env.SERVER_PORT! || +"3000",
  //database
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: +process.env.DB_PORT!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_SENDER: process.env.SMTP_SENDER,

  //secret key
  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,


  SECRET_KEY:process.env.SECRET_KEY,
  //access paths

  ACCESS_PATH: process.env.ACCESS_PATH,
};
