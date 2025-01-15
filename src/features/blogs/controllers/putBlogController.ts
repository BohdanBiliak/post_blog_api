import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";
import { BlogInputModel } from "../../../types/blogs-types";

export const putBlogController = async (req: Request<{ id: string }, any, BlogInputModel>, res: Response) => {
    try {
        const updatedBlog = await blogsRepository.put(req.body, req.params.id);

        if (!updatedBlog) {
            return res.status(404).send({ error: "Blog not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog." });
    }
};


