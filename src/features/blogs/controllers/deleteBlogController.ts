import { Request, Response } from "express";
import { blogsRepository } from "../blogsRepository";

export const deleteBlogController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleteFlag = await blogsRepository.delete(req.params.id);

        if (!deleteFlag) {
            return res.status(404).send({ error: "Blog not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete blog." });
    }
};
