import { blogsCollection } from "../../db/db";
import { BlogDbType } from "../../db/blog-db-type";
import { BlogInputModel, BlogViewModel } from "../../types/blogs-types";
import { ObjectId } from "mongodb";
export const blogsRepository = {
    async create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };

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
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        };
    },
};
