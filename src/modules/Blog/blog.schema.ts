import { z } from "zod";
import { BlogStatus, BlogCategory } from "../../model/Blog";

// ✅ Create Blog
export const createBlogSchema = z.object({
  title: z.string().min(5),
  summary: z.string().min(10),
  content: z.string().min(20),
   slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  coverImage: z.string().url().optional(),

  tags: z.array(z.string()).optional(),

  category: z.nativeEnum(BlogCategory),
  author: z.number().optional(),

 publishedAt: z.date().optional(),

  status: z.nativeEnum(BlogStatus).optional(),
});

// ✅ Update Blog
export const updateBlogSchema = createBlogSchema.partial();

// ✅ Params
export const blogIdParam = z.object({
  blogId: z.string().regex(/^\d+$/),
});

export const slugParam = z.object({
  slug: z.string().min(3),
});


export type CreateBlogDTO = z.infer<typeof createBlogSchema>;
export type UpdateBlogDTO = z.infer<typeof updateBlogSchema>;
export type BlogIdParam = z.infer<typeof blogIdParam>;