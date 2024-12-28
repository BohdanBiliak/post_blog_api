import {Request, Response} from "express";
import {BlogViewModel} from "../../../types/blogs-types";
import {blogsRepository} from "../blogsRepository";

export const findBlogController = (req: Request<{id:string}>, res: Response<BlogViewModel | {}>) => {
    const foundCourse = blogsRepository.find(req.params.id);
    if (foundCourse) {
        res.send(foundCourse)
    }else {
        res.status(404)
    }
}
