export interface CommentInputModel {
    content: string;
    postId: string;
    createdAt: string;
}

export interface CommentViewModel {
    id: string;
    content: string;
    postId: string;
    createdAt: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
}
