import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import BlogModel, { BlogDocument, BlogInput } from "../models/blog.model";
import { databaseResponseTimeHistogram } from "../metrics";


export const createBlog = async (input: BlogInput) => { 

    const metricsLabels = {
    operation: "createProduct",
    };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const Blog = await BlogModel.create(input);
    timer({ ...metricsLabels, success: "true" });
   return Blog.toJSON();
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }

}

export const getAllBlogs = async () => {

    const metricsLabels = {
     operation: "createProduct",
    };
   const timer = databaseResponseTimeHistogram.startTimer();

  try {    
    const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();
   timer({ ...metricsLabels, success: "true" });
   
    return blogs;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}

export const findBlogById = async (query: FilterQuery<BlogDocument>, options: QueryOptions = { lean: true }) => { 
  
  const metricsLabels = {
     operation: "createProduct",
    };
  const timer = databaseResponseTimeHistogram.startTimer();
  
  try {
    const blog = await BlogModel.findOne(query, {}, options);
    timer({ ...metricsLabels, success: "true" });
   return blog;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }

}

export const findAndUpdateBlog = async (query: FilterQuery<BlogDocument>, update: UpdateQuery<BlogDocument>, options: QueryOptions) => {
    const metricsLabels = {
     operation: "createProduct",
    };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const result = await BlogModel.findOneAndUpdate(query, update, options);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
 
}

export const deleteBlog = async (query: FilterQuery<BlogDocument>) => { 
  const metricsLabels = {
     operation: "createProduct",
    };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const result = await BlogModel.deleteOne(query);
    timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });
    throw e;
  }
}
