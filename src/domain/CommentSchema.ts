import mongoose from "mongoose";
import { CommentDBModel } from "../models/database/CommentDBModel";

const commentSchema = new mongoose.Schema<CommentDBModel>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  postId: { type: String, required: true },
  createdAt: { type: String, required: true },
  likesInfo: {
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    users: [{ userId: String, likeStatus: String }],
  },
});

export const CommentMongooseModel = mongoose.model("comments", commentSchema);