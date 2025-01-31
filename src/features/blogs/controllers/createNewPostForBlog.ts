import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const createPostForBlogController = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { title, shortDescription, content } = req.body;

        if (!title || !shortDescription || !content) {
            return res.status(400).json({
                errorsMessages: [
                    { message: "Title is required", field: "title" },
                    { message: "Short description is required", field: "shortDescription" },
                    { message: "Content is required", field: "content" },
                ],
            });
        }

        const newPost = await blogsRepository.createPostForBlog(blogId, title, shortDescription, content);

        if (!newPost) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post for the blog." });
    }
};
