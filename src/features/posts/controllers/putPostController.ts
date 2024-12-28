import {Request, Response} from 'express'
import {PostInputModel} from '../../../types/posts-types'
import {postsRepository} from '../postsRepository'
import {blogsRepository} from "../../blogs/blogsRepository";

export const putPostController = (req: Request<{id: string}, any, PostInputModel>, res: Response) => {
    const foundBlogs = postsRepository.put(req.body, req.params.id)
    res.status(204).send(foundBlogs);
}