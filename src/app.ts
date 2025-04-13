import express from 'express'
import cors from 'cors'
import {SETTINGS} from './settings'
import {blogsRouter} from './features/blogs'
import {testingRouter} from './features/testing'
import {postsRouter} from './features/posts'
import {userRouter} from "./features/user";
import {commentRouter} from "./features/comments";
import {authRouter} from "./features/auth";
import cookieParser from 'cookie-parser';
import {secureRouter} from "./features/SecurityDevices";


export const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
app.use(SETTINGS.PATH.USERS, userRouter)
app.use(SETTINGS.PATH.COMMENTS, commentRouter)
app.use(SETTINGS.PATH.AUTHORIZATION, authRouter )
app.use(SETTINGS.PATH.SECURITY, secureRouter)
