import { Runner } from "../../global/global";
import { Blog } from "../../model/Blog";
import { CreateBlogDTO } from "./blog.schema";

export const BlogRepository = {
  create: async ({ runner, data }: Runner & { data: CreateBlogDTO }) => {
    const repo = runner.manager.getRepository(Blog);
    try {
      return repo.save(repo.create(data));
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAll: async ({ runner }: Runner) => {
    try {
      return runner.manager.getRepository(Blog).find({
        order: { createdAt: "DESC" },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findPublished: async ({ runner }: Runner) => {
   const repo = runner.manager.getRepository(Blog);
    try {
      const result = await repo.find({
        where: { status: "PUBLISHED" },
        order: { publishedAt: "DESC" },
      });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },


    findArchived: async ({ runner }: Runner) => {
   const repo = runner.manager.getRepository(Blog);
    try {
      const result = await repo.find({
        where: { status: "ARCHIVED" },
        order: { createdAt: "DESC" },
      });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },


  findDrafted: async ({ runner }: Runner) => {
   const repo = runner.manager.getRepository(Blog);
    try {
      const result = await repo.find({
        where: { status: "DRAFT" },
        order: { createdAt: "DESC" },
      });
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
   },

  findById: async ({ runner, id }: Runner & { id: number }) => {
    try {
      return runner.manager.getRepository(Blog).findOne({
        where: { blogId: id },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    } 
  },

  findBySlug: async ({ runner, slug }: Runner & { slug: string }) => {
    try {
      return runner.manager.getRepository(Blog).findOne({
        where: { slug },
      });
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  update: async ({
    runner,
    blog,
    data,
  }: Runner & { blog: Blog; data: Partial<CreateBlogDTO> }) => {
    const repo = runner.manager.getRepository(Blog);
    try {
      Object.assign(blog, data);
      return await repo.save(blog);
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  delete: async ({ runner, blog }: Runner & { blog: Blog }) => {
    const repo = runner.manager.getRepository(Blog);
    try {
      const result = await repo.delete(blog.blogId);
      return result;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },
};
