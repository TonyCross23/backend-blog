import { getAllBlogs, findBlogById } from './../services/blog.service';
import { Request, Response } from "express";
import { CreateBlogInput, UpdateBlogInput } from "../schemas/blog.schema";
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

export const getAllBlogsHandler = async (req: Request, res: Response): Promise<void> => {
  const blogs = await getAllBlogs();
  res.status(200).send(blogs);
}

export const findBlogByIdHandler = async (req: Request <UpdateBlogInput["params"]>, res: Response): Promise<void> => { 

  const blogId = req.params.blogId;

  const blog = await findBlogById({ blogId });

  if (!blog) {
     res.status(404).send({ error: "Blog not found" });
  }

  res.status(200).send(blog);
}
