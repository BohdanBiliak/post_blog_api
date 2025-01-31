import { Request, Response } from "express";
import { PostInputModel, PostViewModel } from "../../../types/posts-types";
import {postsService} from "../domain/posts-service";

export const createPostController = async (
    req: Request<any, any, PostInputModel>,
    res: Response
) => {
    try {
        const newPostId = await postsService.create(req.body);
        const newPost = await postsService.findAndMap(newPostId);

        if (!newPost) {
            res.status(404).json({ error: "Post not found after creation" });
            return;
        }

        // Zwracamy utworzony post
        res.status(201).json(newPost);
    } catch (error) {
        // Obsługa błędów
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(400).json({ error: errorMessage });
    }
};
