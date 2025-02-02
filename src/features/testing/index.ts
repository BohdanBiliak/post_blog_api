import {Router} from "express";
import {blogsCollection, postCollection, setDB} from "../../db/db";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req, res) => {
    await blogsCollection.deleteMany({});
    await postCollection.deleteMany({});

    res.status(204).json({})
})