import { Request, Response } from "express";
import { CreateBlogInput } from "../schemas/blog.schema";
import { createBlog } from "../services/blog.service";


export const createBlogHandler = async (req: Request<{}, {}, CreateBlogInput['body'] & { file?: Express.Multer.File }>, res: Response): Promise<void> => {
  const userId = res.locals.user._id;
  
  const { title, content } = req.body;
  
    // Validate image
  if (!req.file) {
    res.status(400).json({ error: "Image upload failed or not provided" });
    return;
  }

  const newPost = {
    title,
    content,
    image: req.file?.path,       // Cloudinary URL
    user: userId,
  };

  const blog = await createBlog(newPost);

  res.status(201).send(blog);
 }
