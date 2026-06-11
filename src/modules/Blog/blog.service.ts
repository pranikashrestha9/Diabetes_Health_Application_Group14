import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { BlogRepository } from "./blog.repository";
import { CreateBlogDTO } from "./blog.schema";

export const BlogService = {
  // CREATE
  createBlog: async ({
    userId,
    data,
  }: {
    userId: number;
    data: CreateBlogDTO;
  }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const blog = await BlogRepository.create({
        runner,
        data: {
          ...data,
          author: { userId } as any,
          publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
        },
      });

      return blog;
    } finally {
      ORMHelper.release(runner);
    }
  },

  // GET ALL (PUBLIC)
  getAllBlogs: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      return await BlogRepository.findPublished({ runner });
    } catch (error) {
      ORMHelper.release(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

    getAllArchivedBlogs: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      return await BlogRepository.findArchived({ runner });
    } catch (error) {
      ORMHelper.release(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

     getAllDraftedBlogs: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      return await BlogRepository.findDrafted({ runner });
    } catch (error) {
      ORMHelper.release(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  getPublishedBlogs: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try{
      const blogs = await BlogRepository.findPublished({ runner });
      return blogs;

    }catch(error){
      ORMHelper.release(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
   },

  // GET BY ID
  getBlogById: async ({ id }: { id: number }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const blog = await BlogRepository.findById({ runner, id });

      if (!blog) throw new Exception("Blog not found", 404);

      return blog;
    } catch (error: any) {
      ORMHelper.release(runner);
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  // GET BY SLUG (PUBLIC)
  //   getBlogBySlug: async ({ slug }: any) => {
  //     const runner = await ORMHelper.createQueryRunner();

  //     try {
  //       const blog = await BlogRepository.findBySlug({ runner, slug });

  //       if (!blog || blog.status !== "PUBLISHED") {
  //         throw new Exception("Blog not found", 404);
  //       }

  //       // 🔥 increment views

  //       await BlogRepository.update({ runner, blog, data: {} });

  //       return blog;
  //     } catch (error: any) {
  //       throw error;
  //     } finally {
  //       ORMHelper.release(runner);
  //     }
  //   },

  // UPDATE
  updateBlog: async ({ id, data }: { id: number; data: any }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const blog = await BlogRepository.findById({ runner, id });

      if (!blog) throw new Exception("Blog not found", 404);

      if (data.status === "PUBLISHED" && !blog.publishedAt) {
        data.publishedAt = new Date();
      }

      return await BlogRepository.update({ runner, blog, data });
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },

  // DELETE
  deleteBlog: async ({ id }: { id: number }) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const blog = await BlogRepository.findById({ runner, id });

      if (!blog) throw new Exception("Blog not found", 404);

      await BlogRepository.delete({ runner, blog });

      return true;
    } catch (error: any) {
      throw error;
    } finally {
      ORMHelper.release(runner);
    }
  },
};
