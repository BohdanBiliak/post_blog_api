import {blogsRepository} from "../blogsRepository";
import {BlogInputModel, BlogViewModel} from "../../../types/blogs-types";
import {BlogDbType} from "../../../db/blog-db-type";

export const blogsService = {
    async create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        return blogsRepository.create(newBlog);
    },

    async find(id: string): Promise<BlogDbType | null> {
        return blogsRepository.find(id)
    },

    async findAndMap(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findAndMap(id);
    },

    async getAll(): Promise<BlogViewModel[]> {
        return  blogsRepository.getAll();
    },

    async delete(id: string): Promise<boolean> {
        return blogsRepository.delete(id);
    },

    async put(blog: BlogInputModel, id: string): Promise<BlogDbType | null> {
     return await blogsRepository.put(blog, id)
    },

    map(blog: BlogDbType): BlogViewModel {
        return blogsRepository.map(blog);
    }

};
