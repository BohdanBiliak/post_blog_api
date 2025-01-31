import { Request, Response } from "express";
import { PostInputModel } from "../../../types/posts-types";
import {postsService} from "../domain/posts-service";

export const putPostController = async (req: Request<{ id: string }, {}, PostInputModel>, res: Response) => {
    try {
        const foundPost = await postsService.find(req.params.id);

        if (!foundPost) {
            return res.status(404).send({ error: "Post not found" });
        }

        await postsService.put(req.body, req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to update post." });
    }
};
