import {blogsRepository} from "../blogsRepository";
import {Request, Response} from "express";
import {BlogInputModel, BlogViewModel} from "../../../types/blogs-types";

export const putBlogController = (req: Request<{id:string}, any, BlogViewModel>, res: Response) => {
   const foundBlogs = blogsRepository.put(req.body, req.params.id)
    res.status(204).send(foundBlogs);
}

