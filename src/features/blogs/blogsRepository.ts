import {BlogDbType} from "../../db/blog-db-type";
import {db} from "../../db/db";
import {BlogInputModel, BlogViewModel} from "../../types/blogs-types";

export const blogsRepository = {
    create(blog: BlogInputModel) {
        const newBlog: BlogDbType = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteURL: blog.websiteUrl
        }
        db.blogs = [...db.blogs, newBlog];
        return newBlog.id;
    },
    find(id:string){
        return db.blogs.find(i => i.id == id);
    },
    findAndMap(id: string){
        const blog = this.find(id)!
        return this.map(blog)
    },
    getAll(){
        return db.blogs;
    },
    delete(id: string){
        let foundCourse = db.blogs
        for(let i=0; i<foundCourse.length; i++){
            if(foundCourse[i].id == id){
                foundCourse.splice(i,1);
                return true
            }else{
                return false;
            }
        }
    },
    put(blog:BlogInputModel, id: string){
        let foundBlog = this.find(id)
        if(foundBlog){
            foundBlog.name = blog.name
            foundBlog.description = blog.description
            foundBlog.websiteURL = blog.websiteUrl
        }
        return foundBlog;
    },
    map(blog: BlogDbType){
        const blogForOutput: BlogViewModel ={
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteURL,
            name: blog.name,
        }
        return blogForOutput
    },
}