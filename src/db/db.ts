import {BlogDbType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";
import {Collection, MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {SETTINGS} from "../settings";
import {UserDBModel} from "./user-db-types";
import {CommentViewModel} from "../features/comments/commentsTypes/commentsTypes";
import {UserAccountDBType} from "../features/user/userTypes/userTypes";
import {SecurityDeviceDBType} from "../features/SecurityDevices/types/types";
dotenv.config()

export let postCollection: Collection<PostDbType>
export let blogsCollection: Collection<BlogDbType>
export let userCollection: Collection<UserDBModel>
export let commentsCollection: Collection<CommentViewModel>
export let accountCollection: Collection<UserAccountDBType>
export let securityDeviceCollection: Collection<SecurityDeviceDBType>;


export async function runDB(url:string):Promise<void> {
    let client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    postCollection = db.collection<PostDbType>(SETTINGS.PATH.POSTS);
    blogsCollection = db.collection<BlogDbType>(SETTINGS.PATH.BLOGS);
    userCollection = db.collection<UserDBModel>(SETTINGS.PATH.USERS);
    commentsCollection = db.collection<CommentViewModel>(SETTINGS.PATH.COMMENTS);
    securityDeviceCollection = db.collection<SecurityDeviceDBType>(SETTINGS.PATH.SECURITY);
    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log("Connected to DB");
    } catch (err) {
        console.error("Error connecting to DB:", err);
        process.exit(1);
    }
}
export type DBtype = {
    blogs: BlogDbType[];
    posts: PostDbType[];
    users: UserDBModel[];
}
export type ReadonlyDBtype = {
    posts: Readonly<PostDbType[]>;
    blogs: Readonly<BlogDbType[]>;
    users: Readonly<UserDBModel[]>;
    comments: Readonly<CommentViewModel[]>;
}
export const db: DBtype = {
    blogs: [],
    posts: [],
    users:[],
}
export const setDB = async (dataset?: Partial<ReadonlyDBtype>) => {
    await blogsCollection.deleteMany({});
    await postCollection.deleteMany({});
    await userCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await securityDeviceCollection.deleteMany({});

    console.log("DB после setDB:", db);
};
