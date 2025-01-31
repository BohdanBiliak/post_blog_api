import { Request, Response } from "express";
import {blogsService} from "../domain/products-services";

export const getAllPostsForBlogController = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const pageNumber = parseInt(req.query.pageNumber as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortBy = req.query.sortBy as string || "createdAt";
        const sortDirection = req.query.sortDirection as string || "desc";
        const blogExists = await blogsService.find(blogId);
        if (!blogExists) {
            return res.status(404).json({ error: "Blog not found" });
        }
        const posts = await blogsService.getAllPostsForBlog(blogId, pageNumber, pageSize, sortBy, sortDirection);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts for the blog." });
    }
};
