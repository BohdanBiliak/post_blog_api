export interface CommentInputModel {
    content: string;
    postId: string;
    createdAt: string;
}

export interface CommentViewModel {
    _id: string;  // Dodajemy _id, które jest wymagane przez test
    id: string;   // Identyfikator generowany na potrzeby systemu
    content: string;
    postId: string;
    createdAt: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
}