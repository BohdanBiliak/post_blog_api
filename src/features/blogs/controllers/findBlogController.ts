import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";
import { BlogViewModel } from "../../../types/blogs-types";

export const findBlogController = async (req: Request<{ id: string }>, res: Response<BlogViewModel | {}>) => {
    try {
        const foundBlog = await blogsRepository.findAndMap(req.params.id);

        if (!foundBlog) {
            return res.status(404).send();
        }

        res.status(200).json(foundBlog);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blog." });
    }
};
