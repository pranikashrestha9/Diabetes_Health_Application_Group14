import { Router } from "express";
import { UserController } from "./user.controller";
import { MulterHelper } from "../../middlewares/multer";
import path from "path";

export const userRoutes = (router: Router) => {
  //   router.patch(
  //     "/user/status/:id",
  //     // validateToken({ checkAdmin: true }),
  //     ZOD.requestParser(
  //       {
  //         schema: userIdSchema,
  //         type: "Params",
  //       },
  //       {
  //         schema: CreateUserSchema.partial(),
  //         type: "Body",
  //       },
  //     ),
  //     UserController.updateUserStatus,
  //   );

  router.post(
    "/register",
    MulterHelper.getStorage(path.resolve("public/profile"), {
      moduleName: "user",
      isFile: false,
    }).single("userProfile"),
    UserController.addUser,
  );

  router.get("/users", UserController.getAllUsers);
};
