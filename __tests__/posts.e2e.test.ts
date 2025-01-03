
// @ts-ignore
import {req} from './helpers/test-helpers'
import {db, setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
// @ts-ignore
import {codedAuth, createString, dataset1, dataset2} from './helpers/datasets'
import {PostInputModel} from '../src/types/posts-types'
import {BlogInputModel} from "../src/types/blogs-types";

describe('/posts', () => {


    it('should create', async () => {
        setDB(dataset1)
        const newPost: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost) // отправка данных
            .expect(201)
        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(dataset1.blogs[0].name)
        expect(typeof res.body.id).toEqual('string')

        expect(res.body).toEqual(db.posts[0])
    })
    it('shouldn\'t create 401', async () => {
        setDB(dataset1)
        const newPost: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(401)

        expect(db.posts.length).toEqual(0)
    })
    it('shouldn\'t create', async () => {
        setDB();
        const newPost: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        };
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send(newPost)
            .expect(400);
        expect(res.body.errorsMessages.length).toEqual(4);
        expect(res.body.errorsMessages[0].field).toEqual('title');
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
        expect(res.body.errorsMessages[2].field).toEqual('content');
        expect(res.body.errorsMessages[3].field).toEqual('blogId');

        expect(db.posts.length).toEqual(0);
    });

    it('should get empty array', async () => {
        setDB()
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)
        expect(res.body.length).toEqual(0)
    })
    it('should get not empty array', async () => {
        setDB(dataset2)
        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(200)
        expect(res.body.length).toEqual(1)
        expect(res.body[0]).toEqual(dataset2.posts[0])
    })
    it('shouldn\'t find', async () => {
        setDB(dataset1)
        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(404)
    })
    it('should find', async () => {
        setDB(dataset2)
        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .expect(200)
        expect(res.body).toEqual(dataset2.posts[0])
    })
    it('should del', async () => {
        setDB(dataset2)
        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204)
        expect(db.posts.length).toEqual(0)
    })
    it('shouldn\'t del', async () => {
        setDB()

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(404)
    })
    it('shouldn\'t del 401', async () => {
        setDB()
        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic' + codedAuth})
            .expect(401)
    })
    it('should update', async () => {
        setDB(dataset2)

        const post: PostInputModel = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            // @ts-ignore
            blogId: dataset2.blogs[0].id,
        }
        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(204)
        // @ts-ignore
        expect(db.posts[0]).toEqual({...db.posts[0], ...post, blogName: dataset2.blogs[0].name})
    })
    it('shouldn\'t update 404', async () => {
        setDB()
        const post: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(404) // проверка на ошибку

        // console.log(res.body)
    })
    it('shouldn\'t update2', async () => {
        setDB(dataset2)
        const post: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(400)
        expect(db).toEqual(dataset2)
        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')
    })
    it('shouldn\'t update 401', async () => {
        setDB(dataset2)
        const post: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(post)
            .expect(401) // проверка на ошибку

        // console.log(res.body)

        expect(db).toEqual(dataset2)
    })
})