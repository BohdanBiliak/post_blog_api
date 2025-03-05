import {commentRepository} from "../commentsReposytory";
import {CommentViewModel} from "../commentsTypes/commentsTypes";


export const commentService = {
    async create(postId: string, content: string, user: { id: string; login: string }): Promise<CommentViewModel> {
        if (!user) {
            throw new Error("User must be authenticated");
        }

        return await commentRepository.create(
            {postId, content, createdAt: new Date().toISOString()},
            user
        );
    },

    async update(commentId: string, content: string, userId: string): Promise<boolean> {
        return await commentRepository.update(commentId, content, userId);
    },

    async delete(commentId: string, userId: string): Promise<boolean> {
        return await commentRepository.delete(commentId, userId);
    },
    async getCommentById(commentId: string): Promise<CommentViewModel | null> {
        return await commentRepository.findById(commentId);

    },
    async getCommentsByPostId(postId: string, page: number, pageSize: number,sortDirection: string): Promise<CommentViewModel[]> {
        return await commentRepository.findByPostId(postId, page, pageSize, sortDirection);
    }
};
