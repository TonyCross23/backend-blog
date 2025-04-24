import { getAllBlogs, findBlogById, deleteBlog, findAndUpdateBlog } from './../services/blog.service';
import { Request, Response } from "express";
import { CreateBlogInput, UpdateBlogInput } from "../schemas/blog.schema";
import { createBlog } from "../services/blog.service";
import cloudinary from '../utils/cloudinary';
import { log } from 'console';


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
    image: req.file.path,       // Cloudinary URL
    user: userId,
  };

  const blog = await createBlog(newPost);
  console.log("Blog created:", blog);
  
  res.status(200).send(blog);
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

export const updateBlogHandler = async (req: Request<UpdateBlogInput["params"]>, res: Response): Promise<void> => { 
  const blogId = req.params.blogId;
  const userId = res.locals.user._id;

  const { title, content } = req.body;

  const blog = await findBlogById({ blogId });

    if (!blog) {
     res.status(404).send({ error: "Blog not found" });
     return;
  }

 // Delete old image from Cloudinary if exists
  if (req.file && blog.image) {
    try {
      // Extract public_id from image URL
      const publicId = blog.image
        .split("/")
        .slice(-1)[0]
        .split(".")[0]; // Extract `xyz` from `https://res.cloudinary.com/.../xyz.jpg`

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Error deleting old image from Cloudinary:", err);
    }
  }

  // Prepare updated fields
  const updatedData: any = {
    title: title || blog.title,
    content: content || blog.content,
    user: userId,
  };

  if (req.file) {
    updatedData.image = req.file.path; // New Cloudinary URL
  }

  const updatedBlog = await findAndUpdateBlog({ blogId }, updatedData, { new: true });

  res.status(200).send(updatedBlog);
}

export const deleteBlogHandler = async (req: Request<UpdateBlogInput["params"]>, res: Response): Promise<void> => { 
  const userId = res.locals.user._id;
  const blogId = req.params.blogId;

  const blog = await findBlogById({ blogId });

  if(!blog) {
    res.sendStatus(404);
    return;
  }

   if (String(blog.user) !== userId) {
     res.sendStatus(403);
     return
   }
  
   // Delete image from Cloudinary
  if (blog.image) {
    try {
      const publicId = blog.image
        .split("/")
        .slice(-1)[0]
        .split(".")[0]; // Extract `abc123` from `https://res.cloudinary.com/.../abc123.jpg`

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  }
  
    await deleteBlog({ blogId });

    res.sendStatus(200);
}
