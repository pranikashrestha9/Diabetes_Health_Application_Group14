import {
  CreateUserInput,
  UpdateUserInput,
  UserIdInput,
} from "./user.schema";
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

    res.status(201).json(
      messageFormater(
        true,
        response,
        "User created successfully",
        201,
      ),
    );
  } catch (error) {
    next(error);
  }
},

  // ✅ Get All Users
  getAllUsers: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await UserService.getAllUsers();

      res.status(200).json(
        messageFormater(
          true,
          response,
          "All users data",
          200,
        ),
      );
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

      res.status(200).json(
        messageFormater(
          true,
          response,
          "User data",
          200,
        ),
      );
    } catch (error) {
      next(error);
    }
  },

  // ✅ Update User
  updateUser: async (
    req: Request<UserIdInput, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userId } = req.params;
      const id = Number(userId);
      const data = req.body;

      const response = await UserService.updateUser(id, data);

      res.status(200).json(
        messageFormater(
          true,
          response,
          "User updated successfully",
          200,
        ),
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

      res.status(200).json(
        messageFormater(
          true,
          response,
          "User deleted successfully",
          200,
        ),
      );
    } catch (error) {
      next(error);
    }
  },

//   // ✅ Update User Status
//   updateUserStatus: async (
//     req: Request<UserIdInput, {}, { isActive: string }>,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const { userId } = req.params;
//       const data = req.body;

//       const id = Number(userId);
//       const response = await UserService.updateUser(
//         id,
//         data,
//       );

//       res.status(200).json(
//         messageFormater(
//           true,
//           response,
//           "User status updated successfully",
//           200,
//         ),
//       );
//     } catch (error) {
//       next(error);
//     }
//   },
};