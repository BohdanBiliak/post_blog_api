import { Request, Response } from "express";
import { postsRepository } from "../postsRepository";
import { PostViewModel } from "../../../types/posts-types";

export const findPostController = async (req: Request<{ id: string }>, res: Response<PostViewModel | {}>) => {
    try {
        const foundPost = await postsRepository.findAndMap(req.params.id);

        if (!foundPost) {
            return res.status(404).send();
        }

        res.status(200).json(foundPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch post." });
    }
};
