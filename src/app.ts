import express from 'express'
import cors from 'cors'
import {SETTINGS} from './settings'
import {blogsRouter} from './features/blogs'
import {testingRouter} from './features/testing'
import {postsRouter} from './features/posts'
import {userRouter} from "./features/user";
import {userController} from "./features/user/controllers/userController";
import {commentRouter} from "./features/comments";
export const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, userRouter)
app.use(SETTINGS.PATH.COMMENTS, commentRouter)
app.post("/auth/login", userController.login);
app.get("/auth/me", userController.getCurrentUser);