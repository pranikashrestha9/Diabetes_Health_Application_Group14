import { Request, Response, NextFunction } from "express";
import { forgotPasswordSchemaInput, loginSchemaInput } from "./auth.schema";
import { authService } from "./authService";
import { messageFormater } from "../libs/messageFormater";

export const authController = {
  login: async (
    req: Request<{}, {}, loginSchemaInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const response = await authService.validateLogin(data);
      const { user, accessToken, refreshToken } = response;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "strict",
      });
      res
        .status(200)
        .json(
          messageFormater(
            true,
            "Successfully added job seeker data",
            { accessToken, user },
            201,
          ),
        );
    } catch (err) {
      next(err);
    }
  },

  getAccessTokenWithRefreshToken: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken } = req.body;

      const response = await authService.refreshAccessToken(refreshToken);
      res
        .status(200)
        .json(messageFormater(true, "Token refreshed", response, 200));
    } catch (err) {
      next(err);
    }
  },

  forgetPassword: async (req: Request<{}, {}, forgotPasswordSchemaInput>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const response = await authService.forgetPassword({ email, password });
      res
        .status(200)
        .json(messageFormater(true, "Password updated successfully", null, 200));
    } catch (err) {
      next(err);
    }
  },

};
