import {BlogDbType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";
import {Collection, MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import {SETTINGS} from "../settings";
dotenv.config()

export let postCollection: Collection<PostDbType>
export let blogsCollection: Collection<BlogDbType>

export async function runDB(url:string):Promise<void> {
    let client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    postCollection = db.collection<PostDbType>(SETTINGS.PATH.POSTS);
    blogsCollection = db.collection<BlogDbType>(SETTINGS.PATH.BLOGS);

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
}
export type ReadonlyDBtype = {
    posts: Readonly<PostDbType[]>;
    blogs: Readonly<BlogDbType[]>;
}
export const db: DBtype = {
    blogs: [],
    posts: []
}
export const setDB = async (dataset?: Partial<ReadonlyDBtype>) => {
    if (!dataset) {
        db.blogs = [];
        db.posts = [];
    } else {
        db.blogs = dataset.blogs ? [...dataset.blogs] : [];
        db.posts = dataset.posts ? [...dataset.posts] : [];
    }
    console.log("DB после setDB:", db);
};
