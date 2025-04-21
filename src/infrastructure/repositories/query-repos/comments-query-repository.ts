import { CommentViewModel } from "../../../models/view/CommentViewModel";
import { CommentMongooseModel } from "../../../domain/CommentSchema";
import { FilterQuery, SortOrder } from "mongoose";
import { Paginator } from "../../../models/view/_Paginator";
import { CommentDBModel } from "../../../models/database/CommentDBModel";
import { inject, injectable } from "inversify";
import { CommentsRepository } from "../comments-repository";
import { ObjectId } from "mongodb";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(CommentsRepository) protected commentsRepository: CommentsRepository
  ) {}
  async findComments(
    pageNumber: number,
    pageSize: number,
    sortBy: string = "createdAt",
    sortDirection: SortOrder,
    postId: string,
    userId?: ObjectId
  ): Promise<Paginator<CommentViewModel[]>> {
    const filter: FilterQuery<CommentDBModel> = { postId: postId };

    const sortingObj: { [key: string]: SortOrder } = { [sortBy]: "desc" };

    if (sortDirection === "asc") {
      sortingObj[sortBy] = "asc";
    }

    const comments = await CommentMongooseModel.find(filter)
      .sort(sortingObj)
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize > 0 ? pageSize : 0)
      .lean();

    const totalCount = await CommentMongooseModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: await this.commentsMapping(comments, userId),
    };
  }

  async findCommentById(
    _id: string,
    userId?: ObjectId
  ): Promise<CommentViewModel | null> {
    const foundComment = await CommentMongooseModel.findOne({ _id });

    if (!foundComment) {
      return null;
    }

    let status;

    if (userId) {
      status = await this.commentsRepository.findUserLikeStatus(_id, userId);
    }

    return {
      id: foundComment._id.toString(),
      content: foundComment.content,
      commentatorInfo: {
        userId: foundComment.commentatorInfo.userId,
        userLogin: foundComment.commentatorInfo.userLogin,
      },
      createdAt: foundComment.createdAt,
      likesInfo: {
        likesCount: foundComment.likesInfo.likesCount,
        dislikesCount: foundComment.likesInfo.dislikesCount,
        myStatus: status || "None",
      },
    };
  }

  private async commentsMapping(
    array: CommentDBModel[],
    userId?: ObjectId
  ): Promise<CommentViewModel[]> {
    return Promise.all(
      array.map(async (comment) => {
        let status;

        if (userId) {
          status = await this.commentsRepository.findUserLikeStatus(
            comment._id.toString(),
            userId
          );
        }

        return {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: status || "None",
          },
        };
      })
    );
  }
}