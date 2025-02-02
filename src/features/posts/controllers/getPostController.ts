import { Request, Response } from "express";
import {postsService} from "../domain/posts-service";

export const getPostsController = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortBy = req.query.sortBy as string || "createdAt";
    const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";

    const posts = await postsService.getAll(pageNumber, pageSize, sortBy, sortDirection);
    res.status(200).json(posts);
};
