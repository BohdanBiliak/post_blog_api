import {db} from "../../db/db";
import {PostInputModel} from "../../types/posts-types";
import {PostViewModel} from "../../types/posts-types";
import {PostDbType} from "../../db/post-db-type";
import  {blogsRepository} from "../blogs/blogsRepository";
import {BlogViewModel} from "../../types/blogs-types";

export const postsRepository = {
    create(post: PostInputModel) {
        const blog = blogsRepository.find(post.blogId);
        if (!blog) {
            throw new Error('Blog not found');
        }

        const newPost: PostDbType = {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blog.name,
        };

        db.posts = [...db.posts, newPost];
        return newPost.id;
    },

    find(id: string){
        return db.posts.find(post => post.id === id);
    },
    findAndMap(id: string) {
        const post = this.find(id)!
        return this.map(post)
    },
    getAll() {
        return db.posts.map(p => this.map(p));
    },
    delete(id: string){
        let foundCourse = db.posts
        for(let i=0; i<foundCourse.length; i++){
            if(foundCourse[i].id == id){
                foundCourse.splice(i,1);
                return true
            }
        }
        return false

    },
    put(post: PostInputModel, id: string) {
        const foundPost = this.find(id);
        if (foundPost) {
            foundPost.title = post.title;
            foundPost.shortDescription = post.shortDescription;
            foundPost.content = post.content;
            foundPost.blogId = post.blogId;
        }
        return foundPost || null;
    },
    map(post: PostDbType){
        const postForOutput: PostViewModel = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName

        }
        return postForOutput;
    }


}