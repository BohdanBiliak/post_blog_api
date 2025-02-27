import {Router} from "express";
import {createBlogController} from "./controllers/createBlogController";
import{getBlogsController} from "./controllers/getBlogController";
import {findBlogValidator, updateBlogValidator} from "./middlewares/blogValidators";
import {deleteBlogController} from "./controllers/deleteBlogController";
import {putBlogController} from "./controllers/putBlogController";
import {blogValidator} from "./middlewares/blogValidators";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {findBlogController} from "./controllers/findBlogController";
import {getAllPostsForBlogController} from "./controllers/getAllPostsForBlog";
import {createPostForBlogController} from "./controllers/createNewPostForBlog";
export const blogsRouter = Router();

blogsRouter.get("/", getBlogsController);
blogsRouter.get('/:id',findBlogValidator,  findBlogController)
blogsRouter.post("/",...blogValidator, createBlogController);
blogsRouter.delete("/:id",adminMiddleware, findBlogValidator ,deleteBlogController);
blogsRouter.put('/:id', ...updateBlogValidator,findBlogValidator,  putBlogController);
blogsRouter.get("/:blogId/posts", getAllPostsForBlogController );
blogsRouter.post("/:blogId/posts",adminMiddleware, createPostForBlogController);
