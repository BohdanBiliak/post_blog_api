import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../types/blogs-types";
import {blogsRepository} from "../blogsRepository";

export const createBlogController = (req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlodId = blogsRepository.create(req.body);
    const newBlog = blogsRepository.findAndMap(newBlodId)
    res.status(201).json(newBlog);
}