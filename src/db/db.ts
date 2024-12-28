import {BlogDbType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";

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
export const setDB = (dataset?: Partial<ReadonlyDBtype>) => {
    if(!dataset)
    db.blogs= []
    db.posts = []
    return
}