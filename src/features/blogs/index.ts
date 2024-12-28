import {Router} from "express";
import {createBlogController} from "./controllers/createBlogController";
import{getBlogsController} from "./controllers/getBlogController";
import {findBlogValidator} from "./middlewares/blogValidators";
import {deleteBlogController} from "./controllers/deleteBlogController";
import {putBlogController} from "./controllers/putBlogController";
import {blogValidator} from "./middlewares/blogValidators";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {findBlogController} from "./controllers/findBlogController";
export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
blogsRouter.post("/",...blogValidator, createBlogController);
blogsRouter.delete("/:id",adminMiddleware, findBlogValidator ,deleteBlogController);
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidator, putBlogController)