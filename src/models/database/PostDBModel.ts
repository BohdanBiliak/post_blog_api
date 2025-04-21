import { ObjectId } from "mongodb";

export class ExtendedUserLikes {
  constructor(
    public addedAt: string,
    public userId: string,
    public userLogin: string,
    public likeStatus: string
  ) {}
}

export class PostDBModel {
  constructor(
    public _id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      users: ExtendedUserLikes[];
    }
  ) {}
}