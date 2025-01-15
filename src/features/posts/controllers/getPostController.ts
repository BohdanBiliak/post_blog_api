import { Request, Response } from "express";
import { postsRepository } from "../postsRepository";

export const getPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await postsRepository.getAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts." });
    }
};
