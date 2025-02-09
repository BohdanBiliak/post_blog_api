import {BlogDbType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";
import {Collection, MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {SETTINGS} from "../settings";
import {UserDBModel} from "./user-db-types";
dotenv.config()

export let postCollection: Collection<PostDbType>
export let blogsCollection: Collection<BlogDbType>
export let userCollection: Collection<UserDBModel>
export async function runDB(url:string):Promise<void> {
    let client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    postCollection = db.collection<PostDbType>(SETTINGS.PATH.POSTS);
    blogsCollection = db.collection<BlogDbType>(SETTINGS.PATH.BLOGS);
    userCollection = db.collection<UserDBModel>(SETTINGS.PATH.USERS);

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
}
export const db: DBtype = {
    blogs: [],
    posts: [],
    users:[]
}
export const setDB = async (dataset?: Partial<ReadonlyDBtype>) => {
    await blogsCollection.deleteMany({});
    await postCollection.deleteMany({});
    await userCollection.deleteMany({});

    console.log("DB после setDB:", db);
};
