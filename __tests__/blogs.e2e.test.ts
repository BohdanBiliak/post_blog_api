// @ts-ignore
import {req} from './helpers/test-helpers'
import {db, setDB} from "../src/db/db";
import {SETTINGS} from "../src/settings";
import {BlogInputModel} from "../src/types/blogs-types";
// @ts-ignore
import {codedAuth, createString, dataset1} from "./helpers/datasets";
import {fromUTF8TOBase64} from "../src/global_middlewares/admin-middleware";

describe("/blogs", () => {
    it('should create', async () => {
        setDB();
        const newBlog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com'
        };

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog)
            .expect(201);

        console.log('Response body:', res.body);  // Логируем ответ сервера

        expect(res.body.name).toEqual(newBlog.name);
        expect(res.body.description).toEqual(newBlog.description);
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl);
        expect(typeof res.body.id).toEqual('string');
        expect(res.body).toEqual(db.blogs[0]);
    });
    it('shouldn\'t create 401', async () => {
        setDB();
        const newBlog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com'
        }
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog)
            .expect(401);
        console.log(res.body)
        expect(db.blogs.length).toEqual(0)
    })
    it('shouldn\'t create', async () => {
        setDB();
        const newBlog: BlogInputModel = {
            name: createString(16),
            description: createString(505),
            websiteUrl: createString(120)
        }
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog)
            .expect(400)

            expect(res.body.errorsMessages.length).toEqual(3)

            expect(res.body.errorsMessages[0].field).toEqual('name')
            expect(res.body.errorsMessages[1].field).toEqual('description')
            expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')


            expect(res.body.errorsMessages[0].message).toEqual('more than 15 or 0');
            expect(res.body.errorsMessages[1].message).toEqual('more than 500 characters long or 0');
            expect(res.body.errorsMessages[2].message).toEqual('more than 100 characters long or 0');
        expect(db.blogs.length).toEqual(0)
    })
    it('should get empty array', async () => {
        setDB()
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)
        expect(res.body.length).toEqual(0)
    })
    it('shouldn\'t get empty array', async () => {
        setDB(dataset1)
        console.log("DB после setDB:", db);
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)
        expect(res.body.length).toEqual(1)
        console.log(res.body.length)
        expect(res.body[0]).toEqual(dataset1.blogs[0])
        console.log(res.body)
        console.log(dataset1.blogs[0])
    })
    it('shouldn\'t find blog with ID 1', async () => {
        setDB(dataset1);
        console.log('DB after setDB:', db);


        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(404);
        console.log('Response body:', res.body);
    })
    it("should find", async () => {
        setDB(dataset1)
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .expect(200)
        console.log(res.body)
        expect(res.body).toEqual(dataset1.blogs[0])
    })
    it('should delete', async () => {
        setDB(dataset1)
        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(204)
        console.log('Response body:', res.body);
        expect(db.blogs.length).toEqual(0)
    })
    it('shouldn\'t delete 401',async () => {
        setDB()
        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic' + codedAuth})
            .expect(401)


    });
    it('should update',async () => {
        setDB(dataset1);
        const blog: BlogInputModel = {
            name: 'n2',
            description: 'd2',
            websiteUrl: 'http://some2.com'
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(204)

        expect(db.blogs[0]).toEqual({...db.blogs[0], ...blog});


    })
    it('shouldn\'t update 404', () => {
        setDB()

        const blog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some2.com'
        }
        const res = req
            .put(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(404)
    });
    it('shouldn\'t update', async  () => {
        setDB(dataset1)
        const blog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)
        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(400)

        console.log(res.body)
             expect(db).toEqual(dataset1)
             expect(res.body.errorsMessages.length).toEqual(3)
             expect(res.body.errorsMessages[0].field).toEqual('name')
             expect(res.body.errorsMessages[1].field).toEqual('description')
             expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

    })
    it('shouldn\'t update 401', async  () => {
        setDB(dataset1)
        const blog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101)


        }
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'eror'})
            .send(blog)
            .expect(401)

        expect(db).toEqual(dataset1)
    })


})
