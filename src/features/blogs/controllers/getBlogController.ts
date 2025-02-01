import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";
import {blogsService} from "../domain/products-services";

export const getBlogsController = async (req: Request, res: Response) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortBy = req.query.sortBy as string || "createdAt";
        const sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";

        const blogs = await blogsService.getAll(pageNumber, pageSize, sortBy, sortDirection);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs." });
    }
};
