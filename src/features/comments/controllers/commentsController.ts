// controllers/commentController.ts
import { Request, Response } from "express";
import {commentService} from "../domain/commentsService";


export const commentController = {
    async create(req: Request, res: Response) {
        const postId = req.params.postId;
        const { content } = req.body;

        try {
            if (!content || !postId) {
                return res.status(400).json({ message: "Content and postId are required" });
            }

            const newComment = await commentService.create(postId, content);

            return res.status(201).json(newComment);
        } catch (error) {
            console.error("Error creating comment:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    async getByPostId(req: Request, res: Response) {
        const postId = req.params.postId;

        try {
            const comments = await commentService.getCommentsByPost(postId);

            if (comments.length === 0) {
                return res.status(404).json({ message: "No comments found for this post" });
            }

            return res.status(200).json(comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
