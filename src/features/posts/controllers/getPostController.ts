import { Request, Response } from "express";
import {postsService} from "../domain/posts-service";

export const getPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await postsService.getAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts." });
    }
};
