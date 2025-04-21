import { Request, Response } from "express";
import { CreateBlogInput } from "../schemas/blog.schema";
import { createBlog } from "../services/blog.service";


export const createBlogHandler = async (req: Request<{}, {}, CreateBlogInput['body']>, res: Response): Promise<void> => {
  const userId = res.locals.user._id;
  
  const body = req.body;

  const blog = await createBlog({ ...body, user: userId });
  res.status(201).json(blog);
 }
