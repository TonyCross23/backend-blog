import { FilterQuery, QueryOptions } from "mongoose";
import BlogModel, { BlogDocument, BlogInput } from "../models/blog.model";


export const createBlog = async (input: BlogInput) => { 
  const Blog = await BlogModel.create(input);
  return Blog.toJSON();
}

export const getAllBlogs = async () => {
  const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();

  return blogs;
}

export const findBlogById = async (query: FilterQuery<BlogDocument>, options: QueryOptions = {lean: true}) => { 
   const blog = await BlogModel.findOne(query, {}, options);
   return blog;
}
