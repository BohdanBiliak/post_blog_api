import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel } from "../../../types/blogs-types";
import {blogsService} from "../domain/products-services";

export const createBlogController = async (
    req: Request<any, any, BlogInputModel>,
    res: Response
) => {
    try {
        const newBlogId = await blogsService.create(req.body);
        const newBlog = await blogsService.findAndMap(newBlogId);

        if (!newBlog) {
            res.status(404).json({ error: "Blog not found after creation" });
            return;
        }

        res.status(201).json(newBlog);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
    }
};
