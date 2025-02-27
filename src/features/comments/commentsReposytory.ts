import {CommentInputModel, CommentViewModel} from "./commentsTypes/commentsTypes";
import {commentsCollection} from "../../db/db";

export const commentRepository = {
    async create(comment: CommentInputModel): Promise<CommentViewModel> {
        const newComment = {
            ...comment,
            id: new Date().toISOString() + Math.random(), // Generowanie ID komentarza
        };
        await commentsCollection.insertOne(newComment); // Dodanie komentarza do bazy
        return newComment;
    },

    async findByPostId(postId: string): Promise<CommentViewModel[]> {
        return commentsCollection.find({ postId }).toArray();
    }
};
