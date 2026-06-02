

import { Request } from "express";
import { TokenPayload } from "../libs/token";



declare global {
  namespace Express {
    interface Request {
      tokenPayload:TokenPayload;
    }
  }
}

export type Runner ={
  runner:QueryRunner;
}