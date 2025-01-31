import { blogsCollection, postCollection } from "../../db/db";
import { BlogDbType } from "../../db/blog-db-type";
import { BlogInputModel, BlogViewModel } from "../../types/blogs-types";
import {PostViewModel} from "../../types/posts-types";
import {PostDbType} from "../../db/post-db-type";
export const blogsRepository = {
    async create(newBlog: BlogDbType) {
        await blogsCollection.insertOne(newBlog);
        return newBlog.id;
    },

    async find(id: string): Promise<BlogDbType | null> {
        return blogsCollection.findOne({ id });
    },

    async findAndMap(id: string): Promise<BlogViewModel | null> {
        const blog = await this.find(id);
        if (!blog) return null;
        return this.map(blog);
    },

    async getAll(): Promise<BlogViewModel[]> {
        const blogs = await blogsCollection.find().toArray();
        return blogs.map((blog) => this.map(blog));
    },

    async delete(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({ id });
        return result.deletedCount === 1;
    },

    async put(blog: BlogInputModel, id: string): Promise<BlogDbType | null> {
        const updatedBlog = await blogsCollection.findOneAndUpdate(
            { id },
            { $set: blog },
            { returnDocument: "after" }
        );
        // @ts-ignore
        return updatedBlog.value;
    },

    map(blog: BlogDbType): BlogViewModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    },
    async getAllPostsForBlog(blogId: string, pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"): Promise<{ pagesCount: number, page: number, pageSize: number, totalCount: number, items: PostViewModel[] }> {
        const totalCount = await postCollection.countDocuments({ blogId });

        const pagesCount = Math.ceil(totalCount / pageSize);
        const skip = (pageNumber - 1) * pageSize;

        const posts = await postCollection
            .find({ blogId })
            .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map((post:any) => ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            })),
        };
    },
    async createPostForBlog(blogId: string, title: string, shortDescription: string, content: string): Promise<PostViewModel | null> {
        const blog = await blogsCollection.findOne({ id: blogId });
        if (!blog) return null;

        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        };

        await postCollection.insertOne(newPost);

        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        };
    },

};
