import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const getBlogsController = async (req: Request, res: Response) => {
    try {
        const blogs = await blogsRepository.getAll();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs." });
    }
};
