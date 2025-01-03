import {DBtype, ReadonlyDBtype} from "../../src/db/db";
import {BlogDbType} from "../../src/db/blog-db-type";
import {PostDbType} from "../../src/db/post-db-type";
import {fromUTF8TOBase64} from "../../src/global_middlewares/admin-middleware";
import {SETTINGS} from "../../src/settings";

export const codedAuth = fromUTF8TOBase64(SETTINGS.ADMIN)

export const createString = (length: number) => {
    let s = ""
    for (let i = 0; i <= length; i++) {
        s+= i % 10

    }
    return s;
}
export const blog1 = {
    id: new Date().toISOString() + Math.random(),
    name: 'n1',
    description: 'd1',
    websiteUrl: 'http://some.com',
}as const
export const post1 =
    {
        id: new Date().toISOString() + Math.random(),
        title: 't1',
        content: 'c1',
        shortDescription: 's1',
        blogId: blog1.id,
        blogName: 'n1'
    }as const
export const dataset1 = {
    blogs: [blog1],
    posts:[]
}as const
export const dataset2= {
    blogs: [blog1],
    posts: [post1],
} as const