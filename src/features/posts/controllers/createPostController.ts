import {Request, Response} from 'express';
import {PostInputModel, PostViewModel} from "../../../types/posts-types";
import {postsRepository} from "../postsRepository";

export const createPostController = async (req: Request<any, any, PostInputModel>, res: Response) => {
    const newPostId = postsRepository.create(req.body);
    const newPost = postsRepository.findAndMap(newPostId);
    res.status(201).json(newPost);
}