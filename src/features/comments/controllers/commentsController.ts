import { Request, Response } from "express";
import {commentService} from "../domain/commentsService";
import {postsService} from "../../posts/domain/posts-service";
import {commentRepository} from "../commentsReposytory";

export const commentController = {
    async create(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const {content} = req.body;
            const user = req.user;

            if (!content || !postId) {
                return res.status(400).json({message: "Content and postId are required"});
            }

            if (!user) {
                return res.status(401).json({message: "Unauthorized: You must be logged in"});
            }
            const post = await postsService.find(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const newComment = await commentService.create(postId, content, user);

            return res.status(201).json(newComment);
        } catch (error) {
            console.error("Error creating comment:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    },

    async update(req: Request, res: Response) {
        try {
            const commentId = req.params.commentsId;
            const {content} = req.body;
            const user = req.user;

            if (!user) {
                return res.status(401).json({message: "Unauthorized"});
            }

            if (!content) {
                return res.status(400).json({message: "Content is required"});
            }

            const comment = await commentService.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({message: "Comment not found"});
            }

            if (comment.commentatorInfo.userId !== user.id) {
                return res.status(403).json({message: "You can only edit your own comments"});
            }

            const updated = await commentService.update(commentId, content, user.id);
            if (!updated) {
                return res.status(500).json({message: "Failed to update comment"});
            }

            return res.status(204).json({message: "Comment updated successfully"});
        } catch (error) {
            console.error("Error updating comment:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    },


    async delete(req: Request, res: Response) {
        try {
            const commentId = req.params.commentsId;
            const user = req.user;

            if (!user) {
                return res.status(401).json({message: "Unauthorized"});
            }

            const comment = await commentService.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({message: "Comment not found"});
            }

            if (comment.commentatorInfo.userId !== user.id) {
                return res.status(403).json({message: "You can only delete your own comments"});
            }

            const deleted = await commentService.delete(commentId, user.id);
            if (!deleted) {
                return res.status(500).json({message: "Failed to delete comment"});
            }

            return res.status(204).json({message: "Comment deleted successfully"});
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
    ,
    async getCommentById(req: Request, res: Response) {
        try {
            const commentId = req.params.commentsId;
            const comment = await commentService.getCommentById(commentId);

            if (!comment) {
                return res.status(404).json({message: "Comment not found"});
            }

            return res.status(200).json(comment);
        } catch (error) {
            console.error("Error fetching comment:", error);
            return res.status(500).json({message: "Internal Server Error"});
        }
    },
    async getCommentsByPostId(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            if (!postId) {
                return res.status(400).json({ message: "Post ID is required" });
            }

            const post = await postsService.find(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            const totalCount = await commentRepository.countCommentsByPostId(postId);
            const comments = await commentService.getCommentsByPostId(postId, page, pageSize);

            if (!comments || comments.length === 0) {
                return res.status(404).json({ message: "No comments found for this post" });
            }

            const pagesCount = Math.ceil(totalCount / pageSize);

            const response = {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items: comments.map(comment => ({
                    id: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    }
                }))
            };

            return res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching comments:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

}