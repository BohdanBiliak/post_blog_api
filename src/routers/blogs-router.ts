import { Router } from "express";
import { authBasic } from "../middlewares/auth/auth-basic";
import { validationBlogsInput } from "../middlewares/validations/input/validation-blogs-input";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationBlogsFindByParamId } from "../middlewares/validations/find-by-id/validation-blogs-find-by-param-id";
import { validationPostsInput } from "../middlewares/validations/input/validation-posts-input";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/BlogsController";
import {tokenParser} from "../middlewares/auth/token-parser";

export const blogsRouter = Router({});

const blogsController = container.get(BlogsController);

blogsRouter.post(
  "/",
  authBasic,
  validationBlogsInput,
  validationErrorCheck,
  blogsController.createBlog.bind(blogsController)
);

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));

blogsRouter.get(
  "/:id",
  validationBlogsFindByParamId,
  validationErrorCheck,
  blogsController.getBlog.bind(blogsController)
);

blogsRouter.put(
  "/:id",
  authBasic,
  validationBlogsFindByParamId,
  validationBlogsInput,
  validationErrorCheck,
  blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete(
  "/:id",
  authBasic,
  validationBlogsFindByParamId,
  validationErrorCheck,
  blogsController.deleteBlog.bind(blogsController)
);

blogsRouter.delete(
  "/",
  authBasic,
  blogsController.deleteBlogs.bind(blogsController)
);

// +++++ Posts in blogs section start +++++

blogsRouter.post(
  "/:id/posts",
  authBasic,
  validationBlogsFindByParamId,
  validationPostsInput,
  validationErrorCheck,
  blogsController.createPost.bind(blogsController)
);

blogsRouter.get(
  "/:id/posts",
  tokenParser,
  validationBlogsFindByParamId,
  validationErrorCheck,
  blogsController.getPosts.bind(blogsController)
);

// ----- Posts in blogs section end -----