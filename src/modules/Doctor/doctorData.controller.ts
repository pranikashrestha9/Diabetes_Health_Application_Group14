import { NextFunction, Request, Response } from "express";
import { CreateDoctorInput, UpdateDoctorInput } from "./doctorData.schema";
import { DoctorDataService } from "./doctorData.service";
import { messageFormater } from "../../libs/messageFormater";

export const DoctorDataController = {
  addDoctorData: async (
    req: Request<{}, {}, CreateDoctorInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const userId = req.tokenPayload.userId;

      const response = await DoctorDataService.addDoctorData({
        userId: userId,
        doctorData: data,
      });

      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully created doctor", 201),
        );
    } catch (error) {
      next(error);
    }
  },

  getDoctorData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.tokenPayload.userId;
      const response = await DoctorDataService.getDoctorDataByUserId(userId);
      res
        .status(200)
        .json(
          messageFormater(
            true,
            response,
            "Doctor data retrieved successfully",
            200,
          ),
        );
    } catch (error) {
      next(error);
    }
  },

  updateDoctorData: async (
    req: Request<{}, {}, UpdateDoctorInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;
      const userId = req.tokenPayload.userId;

      const response = await DoctorDataService.updateDoctorData({
        userId: userId,
        data: data,
      });

      res
        .status(200)
        .json(
          messageFormater(
            true,
            response,
            "Doctor data updated successfully",
            200,
          ),
        );
    } catch (error) {
      next(error);
    }
  },

  getDoctorDataByDoctorId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = Number(req.params.doctorId);
      const response = await DoctorDataService.getDoctorDataByDoctorId(doctorId);
      res
        .status(200)
        .json(
          messageFormater(
            true,
            response,
            "Doctor data retrieved successfully",
            200
          )
        );
    } catch (error) {
      next(error);
    }
  }
};
