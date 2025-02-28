import { Request, Response } from "express";
import {commentService} from "../domain/commentsService";

export const commentController = {
    async create(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const { content } = req.body;
            const user = req.user;

            if (!content || !postId) {
                return res.status(400).json({ message: "Content and postId are required" });
            }

            if (!user) {
                return res.status(401).json({ message: "Unauthorized: You must be logged in" });
            }

            const newComment = await commentService.create(postId, content, user);

            return res.status(201).json(newComment);
        } catch (error) {
            console.error("Error creating comment:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId;
            const { content } = req.body;
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!content) {
                return res.status(400).json({ message: "Content is required" });
            }

            const updated = await commentService.update(commentId, content, user.id);
            if (!updated) {
                return res.status(403).json({ message: "You can only edit your own comments" });
            }

            return res.status(200).json({ message: "Comment updated successfully" });
        } catch (error) {
            console.error("Error updating comment:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const commentId = req.params.commentId;
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const deleted = await commentService.delete(commentId, user.id);
            if (!deleted) {
                return res.status(403).json({ message: "You can only delete your own comments" });
            }

            return res.status(200).json({ message: "Comment deleted successfully" });
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
};
