import {CommentInputModel, CommentViewModel} from "./commentsTypes/commentsTypes";
import {commentsCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";

export const commentRepository = {
    async create(comment: CommentInputModel, user: { id: string; login: string }): Promise<CommentViewModel> {
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const newComment: WithId<any> = {
            ...comment,
            id: new ObjectId().toString(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        };

        await commentsCollection.insertOne(newComment);
        const { postId, _id, ...response } = newComment;
        return response;
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
        const { postId, _id, ...commentData } = comment;
        return {
            ...commentData,
            commentatorInfo: {
                userId: comment.commentatorInfo?.userId || "",
                userLogin: comment.commentatorInfo?.userLogin || "",
            }
        };
    },
    async findByPostId(postId: string, page: number, pageSize: number): Promise<CommentViewModel[]> {
        const skip = (page - 1) * pageSize;
        const comments = await commentsCollection
            .find({ postId })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        return comments.map((comment: any) => ({
            ...comment,
            commentatorInfo: {
                userId: comment.commentatorInfo?.userId || "",
                userLogin: comment.commentatorInfo?.userLogin || "",
            },
            id: comment._id.toString(),
        }));
    },

    async countCommentsByPostId(postId: string): Promise<number> {
        return await commentsCollection.countDocuments({postId});
    }

};
