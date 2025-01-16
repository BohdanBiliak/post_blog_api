import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const putBlogController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const blog = await blogsRepository.find(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        const updatedBlog = await blogsRepository.put( req.body, req.params.id);

        res.status(204).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: "Failed to update blog." });
    }
};
