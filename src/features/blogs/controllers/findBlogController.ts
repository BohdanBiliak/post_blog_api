import {Request, Response} from "express";
import {BlogViewModel} from "../../../types/blogs-types";
import {blogsRepository} from "../blogsRepository";

export const findBlogController = (req: Request<{ id: string }>, res: Response<BlogViewModel | {}>) => {
    const foundBlog = blogsRepository.find(req.params.id);
    console.log(blogsRepository.find(req.params.id));
    console.log('Trying to find blog with ID:', req.params.id);
    if (foundBlog) {
        res.send(foundBlog);
    } else {
        res.sendStatus(404);
    }
}

