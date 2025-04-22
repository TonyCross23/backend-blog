import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
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

export const findAndUpdateBlog = async (query: FilterQuery<BlogDocument>,update: UpdateQuery<BlogDocument>, options: QueryOptions) => {
  return await BlogModel.findOneAndUpdate(query, update, options);
}

export const deleteBlog = async (query: FilterQuery<BlogDocument>) => { 
  return await BlogModel.deleteOne(query);
}
