import {Request, Response} from 'express'
import {PostViewModel} from "../../../types/posts-types";
import {postsRepository} from '../postsRepository'
import {blogsRepository} from "../../blogs/blogsRepository";

export const findPostController = (req: Request<{id: string}>, res: Response<PostViewModel | {}>) => {
    const foundCourse = postsRepository.find(req.params.id);
    if (foundCourse) {
        res.json(foundCourse)
    }else {
        res.status(404)
    }
}