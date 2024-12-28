import {db} from "../../db/db";
import {PostInputModel} from "../../types/posts-types";
import {PostViewModel} from "../../types/posts-types";
import {PostDbType} from "../../db/post-db-type";
import  {blogsRepository} from "../blogs/blogsRepository";
import {BlogViewModel} from "../../types/blogs-types";

export const postsRepository = {
    create(post: PostInputModel){
        const newPost: PostDbType= {
            id: new Date().toISOString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogsRepository.find(post.blogId)!.name
        }
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
            }else{
                return false;
            }
        }

    },
    put(post: PostInputModel, id: string){
        const Post = this.find(id);
        if(Post){
           Post.title = post.title
            Post.shortDescription = post.shortDescription
            Post.content = post.content
        }
        return Post;

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