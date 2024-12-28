import {Request, Response} from 'express'
import {PostViewModel} from "../../../types/posts-types";
import {postsRepository} from '../postsRepository'
import {blogsRepository} from "../../blogs/blogsRepository";

export const getPostsController = (req: Request, res: Response) => {
    const Blogs = postsRepository.getAll()
    res.json(Blogs)
}