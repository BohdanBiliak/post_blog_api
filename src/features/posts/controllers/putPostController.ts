import { Request, Response } from "express";
import { postsRepository } from "../postsRepository";
import { PostInputModel } from "../../../types/posts-types";

export const putPostController = async (req: Request<{ id: string }, {}, PostInputModel>, res: Response) => {
    try {
        const foundPost = await postsRepository.find(req.params.id);

        if (!foundPost) {
            return res.status(404).send({ error: "Post not found" });
        }

        await postsRepository.put(req.body, req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to update post." });
    }
};
