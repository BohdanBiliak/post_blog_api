import { PostInputModel, PostViewModel } from "../../../types/posts-types";
import { PostDbType } from "../../../db/post-db-type";
import { blogsRepository } from "../../blogs/blogsRepository";
import {postsRepository} from "../postsRepository";

export const postsService = {
    async create(post: PostInputModel): Promise<string> {
        const blog = await blogsRepository.find(post.blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        const newPost: PostDbType = {
            blogId: post.blogId,
            blogName:blog.name,
            content: post.content,
            createdAt: new Date().toISOString(),
            id: new Date().toISOString() + Math.random(),
            shortDescription: post.shortDescription,
            title: post.title,
        };
        return postsRepository.create(newPost);
    },

    async find(id: string): Promise<PostDbType | null> {
        return postsRepository.find(id);
    },

    async findAndMap(id: string): Promise<PostViewModel | null> {
        return postsRepository.findAndMap(id )
    },
    async getAll(): Promise<PostViewModel[]> {
      return postsRepository.getAll()
    },

    async delete(id: string): Promise<boolean> {
        return postsRepository.delete(id)
    },

    async put(post: PostInputModel, id: string): Promise<boolean> {
        const updatedPost = await postsRepository.put(post, id);
        return updatedPost !== null;
    },

    map(post: PostDbType): PostViewModel {
        return postsRepository.map(post);
    },
};
