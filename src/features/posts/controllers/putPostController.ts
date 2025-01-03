import {Request, Response} from 'express'
import {PostInputModel} from '../../../types/posts-types'
import {postsRepository} from '../postsRepository'
import {blogsRepository} from "../../blogs/blogsRepository";

export const putPostController = (
    req: Request<{ id: string }, {}, PostInputModel>,
    res: Response
): Response<any> => {
    const foundPost = postsRepository.find(req.params.id);

    if (!foundPost) {
        return res.status(404).send({ error: 'Post not found' });
    }

    const updatedPost = postsRepository.put(req.body, req.params.id);
    return res.status(204).send(updatedPost);
};