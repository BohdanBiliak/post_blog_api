import {Request, Response} from "express";
import {blogsRepository} from "../blogsRepository";

export const getBlogsController = (req: Request, res: Response) => {
     const Blogs = blogsRepository.getAll()
    res.json(Blogs)
}