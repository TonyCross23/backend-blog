import BlogModel, { BlogInput } from "../models/blog.model";


export const createBlog = async (input: BlogInput) => { 
  const Blog = await BlogModel.create(input);
  return Blog.toJSON();
}
