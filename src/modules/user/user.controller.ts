import { CreateUserInput, UpdateUserInput, UserIdInput } from "./user.schema";
import { Request, Response, NextFunction } from "express";
import { Exception } from "../../libs/exceptionHandler";
import { UserService } from "./user.service";
import { messageFormater } from "../../libs/messageFormater";

export const UserController = {
  // ✅ Create User (generic - without role-specific entity)
  addUser: async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data = req.body;

      // ✅ Default image path
      let profileImagePath = "/public/profile/default.jpg";

      // ✅ If user uploaded file
      if (req.file && req.file.filename) {
        profileImagePath = `/public/profile/${req.file.filename}`;
      }

      // ✅ attach to payload
      data.profileImageURL = profileImagePath;

      const response = await UserService.createUser(data);

      // 🌐 convert to full URL (optional but recommended)
      if (response.profileImageURL) {
        response.profileImageURL = `${req.protocol}://${req.get("host")}${response.profileImageURL}`;
      }

      res
        .status(201)
        .json(
          messageFormater(true, response, "User created successfully", 201),
        );
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get All Users
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await UserService.getAllUsers();

      const formatted = response.map((user: any) => ({
        ...user,
        profileImageURL: user.profileImageURL
          ? `${req.protocol}://${req.get("host")}${user.profileImageURL}`
          : null,
      }));
      res
        .status(200)
        .json(messageFormater(true, formatted, "All users data", 200));
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get User By ID
  getUserById: async (
    req: Request<UserIdInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const id = Number(userId);
      const response = await UserService.getUserById(id);

      if (!response) {
        throw new Exception("User not found", 404);
      }

      if (response.profileImageURL) {
        response.profileImageURL = `${req.protocol}://${req.get("host")}${response.profileImageURL}`;
      }

      res.status(200).json(messageFormater(true, response, "User data", 200));
    } catch (error) {
      next(error);
    }
  },

  // ✅ Update User
  updateUser: async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.tokenPayload.userId; // Assuming userId is in token payload for authenticated users.
      const data = req.body;
      console.log("Received update data:", data);
      const response = await UserService.updateUser(id, data);

      if (response.profileImageURL) {
        response.profileImageURL = `${req.protocol}://${req.get("host")}${response.profileImageURL}`;
      }
      res
        .status(200)
        .json(
          messageFormater(true, response, "User updated successfully", 200),
        );
    } catch (error) {
      next(error);
    }
  },

  // ✅ Delete User
  deleteUser: async (
    req: Request<UserIdInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const id = Number(userId);

      const response = await UserService.deleteUser(id);

      res
        .status(200)
        .json(
          messageFormater(true, response, "User deleted successfully", 200),
        );
    } catch (error) {
      next(error);
    }
  },
  getUserWithMedicalData: async (
    req: Request<UserIdInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;

      const id = Number(userId);

      const response = await UserService.getUserWithMedicalData(id);

      if (response.profileImageURL) {
        response.profileImageURL = `${req.protocol}://${req.get("host")}${response.profileImageURL}`;
      }
      res
        .status(200)
        .json(
          messageFormater(true, response, "User with medical data found", 200),
        );
    } catch (error) {
      next(error);
    }
  },

  getAllDoctors: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllDoctors();

      const formatted = users.map((user: any) => ({
        ...user,
        profileImageURL: user.profileImageURL
          ? `${req.protocol}://${req.get("host")}${user.profileImageURL}`
          : null,
      }));

      res
        .status(200)
        .json(messageFormater(true, "All doctors data", formatted, 200));
    } catch (error) {
      next(error);
    }
  },

  getAllPatients: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAllPatients();

      const formatted = users.map((user: any) => ({
        ...user,
        profileImageURL: user.profileImageURL
          ? `${req.protocol}://${req.get("host")}${user.profileImageURL}`
          : null,
      }));

      res
        .status(200)
        .json(messageFormater(true, "All patients data", formatted, 200));
    } catch (error) {
      next(error);
    }
  },

  getAllContentManagers: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const users = await UserService.getAllContentManagers();

      const formatted = users.map((user: any) => ({
        ...user,
        profileImageURL: user.profileImageURL
          ? `${req.protocol}://${req.get("host")}${user.profileImageURL}`
          : null,
      }));

      res
        .status(200)
        .json(
          messageFormater(true, "All content managers data", formatted, 200),
        );
    } catch (error) {
      next(error);
    }
  },

  updateUserStatus: async (
    req: Request<UserIdInput, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const id = Number(userId);
      const data = req.body;
      const response = await UserService.updateUser(id, data);

      if (response.profileImageURL) {
        response.profileImageURL = `${req.protocol}://${req.get("host")}${response.profileImageURL}`;
      }
      res
        .status(200)
        .json(
          messageFormater(
            true,
            response,
            "User status updated successfully",
            200,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
};
