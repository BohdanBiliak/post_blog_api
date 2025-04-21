import { ObjectId } from "mongodb";
import { PostsRepository } from "../infrastructure/repositories/posts-repository";
import { PostDBModel } from "../models/database/PostDBModel";
import { PostViewModel } from "../models/view/PostViewModel";
import { inject, injectable } from "inversify";
import { UsersService } from "./users-service";
import { BlogsRepository } from "../infrastructure/repositories/blogs-repository";
import { UsersRepository } from "../infrastructure/repositories/users-repository";

@injectable()
export class PostsService {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(UsersRepository) protected usersRepository: UsersRepository
  ) {}
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<PostViewModel | null> {
    const blog = await this.blogsRepository.findBlogById(blogId);

    if (!blog) {
      return null;
    }

    const newPost = new PostDBModel(
      new ObjectId(),
      title,
      shortDescription,
      content,
      blogId,
      blog.name,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        users: [],
      }
    );

    return this.postsRepository.createPost(newPost);
  }

  async updatePost(_id: string, post: PostViewModel): Promise<boolean> {
    return this.postsRepository.updatePost(
      _id,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId
    );
  }

  async deletePost(_id: string): Promise<boolean> {
    return this.postsRepository.deletePost(_id);
  }

  async deleteAll(): Promise<boolean> {
    return this.postsRepository.deleteAll();
  }

  async updateLikeStatus(
    postId: string,
    likeStatus: string,
    userId: ObjectId
  ): Promise<boolean> {
    const foundPost = await this.postsRepository.findPostById(postId);

    if (!foundPost) {
      return false;
    }

    let likesCount = foundPost.likesInfo.likesCount;
    let dislikesCount = foundPost.likesInfo.dislikesCount;

    const foundUser = await this.postsRepository.findUserInLikesInfo(
      postId,
      userId
    );

    const addedAt = new Date().toISOString();
    const user = await this.usersRepository.findUserById(userId);
    const login = user!.accountData.login;

    if (!foundUser) {
      await this.postsRepository.pushUserInLikesInfo(
        postId,
        userId,
        likeStatus,
        addedAt,
        login
      );

      if (likeStatus === "Like") {
        likesCount++;
      }

      if (likeStatus === "Dislike") {
        dislikesCount++;
      }

      return this.postsRepository.updateLikesCount(
        postId,
        likesCount,
        dislikesCount
      );
    }

    let userLikeDBStatus = await this.postsRepository.findUserLikeStatus(
      postId,
      userId
    );

    switch (userLikeDBStatus) {
      case "None":
        if (likeStatus === "Like") {
          likesCount++;
        }

        if (likeStatus === "Dislike") {
          dislikesCount++;
        }

        break;

      case "Like":
        if (likeStatus === "None") {
          likesCount--;
        }

        if (likeStatus === "Dislike") {
          likesCount--;
          dislikesCount++;
        }
        break;

      case "Dislike":
        if (likeStatus === "None") {
          dislikesCount--;
        }

        if (likeStatus === "Like") {
          dislikesCount--;
          likesCount++;
        }
    }

    await this.postsRepository.updateLikesCount(
      postId,
      likesCount,
      dislikesCount
    );

    return this.postsRepository.updateLikesStatus(postId, userId, likeStatus);
  }
}