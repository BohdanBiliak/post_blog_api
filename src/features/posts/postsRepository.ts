import { postCollection } from "../../db/db";
import { PostInputModel, PostViewModel } from "../../types/posts-types";
import { PostDbType } from "../../db/post-db-type";
import { blogsRepository } from "../blogs/blogsRepository";

export const postsRepository = {
    async create(post: PostInputModel): Promise<string> {
        const blog = await blogsRepository.find(post.blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }

        const newPost: PostDbType = {
            blogId: post.blogId,
            blogName: blog.name,
            content: post.content,
            createdAt: new Date().toISOString(),
            id: new Date().toISOString() + Math.random(),
            shortDescription: post.shortDescription,
            title: post.title,
        };

        await postCollection.insertOne(newPost);
        return newPost.id;
    },

    async find(id: string): Promise<PostDbType | null> {
        return postCollection.findOne({ id });
    },

    async findAndMap(id: string): Promise<PostViewModel | null> {
        const post = await this.find(id);
        if (!post) return null;
        return this.map(post);
    },

    async getAll(): Promise<PostViewModel[]> {
        const posts = await postCollection.find().toArray();
        return posts.map((post) => this.map(post)); // Nie używamy Promise.all
    },

    async delete(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({ id });
        return result.deletedCount === 1;
    },

    async put(post: PostInputModel, id: string): Promise<PostDbType | null> {
        const updatedPost = await postCollection.findOneAndUpdate(
            { id },
            { $set: post },
            { returnDocument: "after" }
        );
        // @ts-ignore
        return updatedPost.value || null;
    },

    map(post: PostDbType): PostViewModel {
        return {
            blogId: post.blogId,
            blogName: post.blogName,
            content: post.content,
            createdAt:post.createdAt,
            id: post.id,
            shortDescription: post.shortDescription,
            title: post.title,

        };
    },
};
