import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const createPostForBlogController = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const { title, shortDescription, content } = req.body;

        let errors: { message: string, field: string }[] = [];

        // Validate title
        if (!title) {
            errors.push({ message: "Title is required", field: "title" });
        } else if (title.length > 30) {
            errors.push({ message: "Title must be at most 30 characters long", field: "title" });
        }

        // Validate shortDescription
        if (!shortDescription) {
            errors.push({ message: "Short description is required", field: "shortDescription" });
        } else if (shortDescription.length > 100) {
            errors.push({ message: "Short description must be at most 100 characters long", field: "shortDescription" });
        }

        if (!content) {
            errors.push({ message: "Content is required", field: "content" });
        } else if (content.length > 1000) {
            errors.push({ message: "Content must be at most 1000 characters long", field: "content" });
        }



        if (errors.length > 0) {
            return res.status(400).json({ errorsMessages: errors });
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
