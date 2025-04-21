import mongoose from "mongoose";
import { BlogDBModel } from "../models/database/BlogDBModel";

const blogSchema = new mongoose.Schema<BlogDBModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

export const BlogMongooseModel = mongoose.model("blogs", blogSchema);