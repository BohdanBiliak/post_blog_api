import {commentRepository} from "../commentsReposytory";
import {CommentViewModel} from "../commentsTypes/commentsTypes";


export const commentService = {
    async create(postId: string, content: string, user: { id: string; login: string }): Promise<CommentViewModel> {
        if (!user) {
            throw new Error("User must be authenticated");
        }

        const newComment = await commentRepository.create(
            { postId, content, createdAt: new Date().toISOString() },
            user
        );


        return newComment;
    },

    async update(commentId: string, content: string, userId: string): Promise<boolean> {
        const updated = await commentRepository.update(commentId, content, userId);
        return updated;
    },

    async delete(commentId: string, userId: string): Promise<boolean> {
        const deleted = await commentRepository.delete(commentId, userId);
        return deleted;
    },
    async getCommentById(commentId: string): Promise<CommentViewModel | null> {
        return await commentRepository.findById(commentId);
    }
};
