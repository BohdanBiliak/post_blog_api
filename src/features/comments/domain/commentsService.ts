import {CommentInputModel, CommentViewModel} from "../commentsTypes/commentsTypes";
import {commentRepository} from "../commentsReposytory";

export const commentService = {
    async create(postId: string, content: string): Promise<CommentViewModel> {
        const newComment: CommentInputModel = {
            postId,
            content,
            createdAt: new Date().toISOString(),
        };
        return commentRepository.create(newComment);
    },

    async getCommentsByPost(postId: string): Promise<CommentViewModel[]> {
        return commentRepository.findByPostId(postId);
    }
};
