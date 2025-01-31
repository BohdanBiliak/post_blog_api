import { Request, Response } from "express";
import {postsService} from "../domain/posts-service";

export const delPostController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleteFlag = await postsService.delete(req.params.id);

        if (!deleteFlag) {
            return res.status(404).send({ error: "Post not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post." });
    }
};
