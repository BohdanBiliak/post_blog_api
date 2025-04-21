import { ObjectId } from "mongodb";

export class UserLikes {
  constructor(public userId: string, public likeStatus: string) {}
}

export class CommentDBModel {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public postId: string,
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      users: UserLikes[];
    }
  ) {}
}