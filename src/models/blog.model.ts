import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { UserDocument } from "./user.model";

export interface BlogInput {
  user: UserDocument["_id"];
  title: string;
  content: string;
  image: string;
  blogId?: string;
}

export interface BlogDocument extends BlogInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const blogSession = new mongoose.Schema({
  blogId: {
    type: String,
    required: true,
    unique: true,
    default: () => `blog_${uuidv4()}`
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
}, {
  timestamps: true
})

const BlogModel = mongoose.model<BlogDocument>("Blog", blogSession);
export default BlogModel;
