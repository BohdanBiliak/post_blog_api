import { CommentInputModel, CommentViewModel } from "./commentsTypes/commentsTypes";
import { commentsCollection } from "../../db/db";
import {ObjectId} from "mongodb";

export const commentRepository = {
    async create(comment: CommentInputModel, user: { id: string; login: string }): Promise<CommentViewModel> {
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const newComment = {
            ...comment,
            id: new Date().toISOString() + Math.random(),
            _id: new ObjectId().toString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        };

        await commentsCollection.insertOne(newComment);
        return newComment;
    },


    async findByPostId(postId: string): Promise<CommentViewModel[]> {
        const comments = await commentsCollection.find({ postId }).toArray();
        return comments.map((comment: any) => ({
            ...comment,
            commentatorInfo: {
                userId: comment.commentatorInfo?.userId || "",
                userLogin: comment.commentatorInfo?.userLogin || "",
            },
        }));
    },

    async update(commentId: string, content: string, userId: string): Promise<boolean> {
        const comment = await commentsCollection.findOne({ id: commentId });

        if (!comment) return false;
        if (comment.commentatorInfo.userId !== userId) return false; // Проверка на автора

        const result = await commentsCollection.updateOne(
            { id: commentId },
            { $set: { content } }
        );
        return result.modifiedCount > 0;
    },

    async delete(commentId: string, userId: string): Promise<boolean> {
        const comment = await commentsCollection.findOne({ id: commentId });

        if (!comment) return false;
        if (comment.commentatorInfo.userId !== userId) return false; // Только автор может удалить

        const result = await commentsCollection.deleteOne({ id: commentId });
        return result.deletedCount > 0;
    },
    async findById(commentId: string): Promise<CommentViewModel | null> {
        const comment = await commentsCollection.findOne({ id: commentId });
        if (!comment) return null;

        return {
            ...comment,
            commentatorInfo: {
                userId: comment.commentatorInfo?.userId || "",
                userLogin: comment.commentatorInfo?.userLogin || "",
            }
        };
    }
};
