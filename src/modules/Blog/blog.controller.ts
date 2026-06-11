import { Request, Response, NextFunction } from "express";

import { BlogIdParam, CreateBlogDTO, UpdateBlogDTO } from "./blog.schema";
import { BlogService } from "./blog.service";
import { messageFormater } from "../../libs/messageFormater";

export const BlogController = {
  create: async (
    req: Request<{}, {}, CreateBlogDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.tokenPayload.userId;

      let coverImage = "/public/blog/default.jpg";

      // ✅ If user uploaded file
      if (req.file && req.file.filename) {
        coverImage = `/public/blog/${req.file.filename}`;
      }

      // ✅ attach to payload
      const blogData = req.body;
      blogData.coverImage = coverImage;

      const blog = await BlogService.createBlog({
        userId,
        data: blogData,
      });

      if (blog.coverImage) {
        blog.coverImage = `${req.protocol}://${req.get("host")}${blog.coverImage}`;
      }

      res.json(messageFormater(true, "Blog created", blog, 201));
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await BlogService.getAllBlogs();

      if (blogs.length === 0) {
        res.json(messageFormater(true, "No blogs found", [], 200));
        return;
      }

      const formatted = blogs.map((blog: any) => ({
        ...blog,
        coverImage: blog.coverImage
          ? `${req.protocol}://${req.get("host")}${blog.coverImage}`
          : null,
      }));
      res.json(messageFormater(true, "Blogs fetched", formatted, 200));
    } catch (err) {
      next(err);
    }
  },


    getAllArchived: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await BlogService.getAllArchivedBlogs();

      if (blogs.length === 0) {
        res.json(messageFormater(true, "No archived blogs found", [], 200));
        return;
      }

      const formatted = blogs.map((blog: any) => ({
        ...blog,
        coverImage: blog.coverImage
          ? `${req.protocol}://${req.get("host")}${blog.coverImage}`
          : null,
      }));
      res.json(messageFormater(true, "Archived blogs fetched", formatted, 200));
    } catch (err) {
      next(err);
    }
  },


  getAllDrafted: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await BlogService.getAllDraftedBlogs();

      if (blogs.length === 0) {
        res.json(messageFormater(true, "No drafted blogs found", [], 200));
        return;
      }

      const formatted = blogs.map((blog: any) => ({
        ...blog,
        coverImage: blog.coverImage
          ? `${req.protocol}://${req.get("host")}${blog.coverImage}`
          : null,
      }));
      res.json(messageFormater(true, "Drafted blogs fetched", formatted, 200));
    } catch (err) {
      next(err);
    }
  },

  getById: async (
    req: Request<BlogIdParam>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const blog = await BlogService.getBlogById({
        id: Number(req.params.blogId),
      });

      res.json(messageFormater(true, "Blog fetched", blog, 200));
    } catch (err) {
      next(err);
    }
  },

  //   getBySlug: async (req: any, res: Response, next: NextFunction) => {
  //     try {
  //       const blog = await BlogService.getBlogBySlug({
  //         slug: req.params.slug,
  //       });

  //       res.json(messageFormater(true, "Blog fetched", blog, 200));
  //     } catch (err) {
  //       next(err);
  //     }
  //   },

  update: async (
    req: Request<BlogIdParam, {}, UpdateBlogDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const blog = await BlogService.updateBlog({
        id: Number(req.params.blogId),
        data: req.body,
      });

      res.json(messageFormater(true, "Blog updated", blog, 200));
    } catch (err) {
      next(err);
    }
  },

  delete: async (
    req: Request<BlogIdParam>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await BlogService.deleteBlog({
        id: Number(req.params.blogId),
      });

      res.json(messageFormater(true, "Blog deleted", null, 200));
    } catch (err) {
      next(err);
    }
  },

  getPublishedBlogs: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const blogs = await BlogService.getPublishedBlogs();
      res.json(messageFormater(true, "Published blogs fetched", blogs, 200));
    } catch (err) {
      next(err);
    }
  },
};
