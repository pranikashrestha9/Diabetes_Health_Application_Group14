import { Router } from "express";
import { validateToken } from "../../auth/validateToken";
import ZOD from "../../middlewares/schemaValidator";
import { blogIdParam, createBlogSchema } from "./blog.schema";
import { BlogController } from "./blog.controller";

export const blogRouter = (router: Router) => {
  // 🔐 Create (Admin / Manager)
  router.post(
    "/blog",
    validateToken({ checkInternalManager: true }),
    ZOD.requestParser({
      schema: createBlogSchema,
      type: "Body",
    }),

    BlogController.create,
  );

  // // 🌍 Public
  // router.get("/", BlogController.getAll);

  // router.get(
  //   "/slug/:slug",
  //   validate(slugParam, "params"),
  //   BlogController.getBySlug
  // );

  // 🔐 Protected
  router.get("/blog:blogId", BlogController.getById);

  router.get("/published-blogs", validateToken(), BlogController.getAll);

  router.get(
    "/draft-blogs",
    validateToken({ checkInternalManager: true }),
    BlogController.getAllDrafted,
  );

  router.get(
    "/archived-blogs",
    validateToken({ checkInternalManager: true }),
    BlogController.getAllArchived,
  );

  router.patch(
    "/blog/:blogId",
    validateToken({ checkInternalManager: true }),
    ZOD.requestParser({
      schema: createBlogSchema.partial(),
      type: "Body",
    }),
    ZOD.requestParser({
      schema: blogIdParam,
      type: "Params",
    }),
    BlogController.update,
  );

  router.delete(
    "/blog/:blogId",
    validateToken(),
    ZOD.requestParser({
      schema: blogIdParam,
      type: "Params",
    }),
    BlogController.delete,
  );
};
