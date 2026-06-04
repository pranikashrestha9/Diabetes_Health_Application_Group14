import { Router } from "express";
import { UserController } from "./user.controller";
import { MulterHelper } from "../../middlewares/multer";
import path from "path";
import ZOD from "../../middlewares/schemaValidator";
import { CreateUserSchema, UserIdSchema } from "./user.schema";
import { validateToken } from "../../auth/validateToken";

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
    //  ZOD.requestParser({
    //    schema: CreateUserSchema,
    //    type: "Body",
    //  }),

    // (req) => console.log("hello", req.body),
    UserController.addUser,
  );

  router.get(
    "/users",
    //  validateToken({ checkAdmin: true }),
    UserController.getAllUsers,
  );

  router.get(
    "/user-medical-data/:userId",
    ZOD.requestParser({
      schema: UserIdSchema,
      type: "Params",
    }),
    UserController.getUserWithMedicalData,
  );

  router.get(
    "/user/:userId",
    ZOD.requestParser({
      schema: UserIdSchema,
      type: "Params",
    }),
    UserController.getUserById,
  );

  router.delete(
    "/user/:userId",
    // validateToken({ checkAdmin: true }),
    ZOD.requestParser({
      schema: UserIdSchema,
      type: "Params",
    }),
    UserController.deleteUser,
  );

  router.patch(
    "/user/:userId",
    ZOD.requestParser(
      {
        schema: CreateUserSchema.partial(),
        type: "Body",
      },
      {
        schema: UserIdSchema,
        type: "Params",
      },
    ),
    // (req) => console.log("hello", req.body, req.params),
    UserController.updateUserok,
  );

  router.get(
    "/patients",
    validateToken({ checkAdmin: true }),
    UserController.getAllPatients,
  );
  router.get(
    "/doctors",
    validateToken({ checkAdmin: true }),
    UserController.getAllDoctors,
  );
  router.get(
    "/content-managers",
    validateToken({ checkAdmin: true }),
    UserController.getAllContentManagers,
  );
};
