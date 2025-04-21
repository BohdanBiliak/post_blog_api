import {
  blogCreator,
  blogReturner,
  blogUpdater,
  eraseAll,
  eraser,
  eraserWithId,
  findPosts,
  firstBlog,
  firstBlogId,
  firstPost,
  firstPostId,
  getter,
  getterWithId,
  postCreator,
  postReturner,
  postsLength,
  postUpdater,
} from "../../test-utils/test-functions";
import {
  basicAuthKey,
  basicAuthValue,
  blogsURI,
  invalidAuthValue,
  invalidURI,
  longString1013,
  longString109,
  longString39,
  postContentString,
  postNewContentString,
  postNewShortDescriptionString,
  postNewTitleString,
  postShortDescriptionString,
  postsURI,
  postTitleString,
  sortingString02,
  sortingString04,
  sortingString05,
  sortingString07,
  sortingString09,
} from "../../test-utils/test-strings";
import request from "supertest";
import { app} from "../../src";
import { emptyOutput } from "../../test-utils/test-objects";

describe("Posts testing", () => {
  describe("Posts status 400 checks", () => {
    beforeAll(eraseAll);
    it("should create new blog for posts testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should NOT create new post without title", async () => {
      // Trying to create a post without title
      const response = await postCreator(undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect title type", async () => {
      // Trying to create a post with incorrect title type
      const response = await postCreator(undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect title length", async () => {
      // Trying to create a post with incorrect title length
      const response = await postCreator(undefined, longString39);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post without short description", async () => {
      // Trying to create a post without short description
      const response = await postCreator(undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect short description type", async () => {
      // Trying to create a post with incorrect short description type
      const response = await postCreator(undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect short description length", async () => {
      // Trying to create a post with incorrect short description length
      const response = await postCreator(undefined, undefined, longString109);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post without content", async () => {
      // Trying to create a post without content
      const response = await postCreator(undefined, undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect content type", async () => {
      // Trying to create a post with incorrect content type
      const response = await postCreator(undefined, undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect content length", async () => {
      // Trying to create a post with incorrect content length
      const response = await postCreator(
        undefined,
        undefined,
        undefined,
        longString1013
      );
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new post with incorrect blogId", async () => {
      // Trying to create a post with incorrect blogId
      const response = await request(app)
        .post(postsURI)
        .send({
          title: postTitleString,
          shortDescription: postShortDescriptionString,
          content: postContentString,
          blogId: "someString",
        })
        .set(basicAuthKey, basicAuthValue);
      expect(response.status).toBe(400);

      // Checking result
      const length = await postsLength();
      expect(length).toBe(0);
    });
  });
  describe("Posts status 401 checks", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should create new post for testing", async () => {
      // Trying to create a post
      const response = await postCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const post = await firstPost();
      const returnedPost = await postReturner();
      expect(post).toStrictEqual(returnedPost);
    });
    it("should return 401 when creating post with incorrect credentials", async () => {
      const response = await postCreator(
        undefined,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when creating post in blog with incorrect credentials", async () => {
      // Finding blogId
      const blogId = await firstBlogId();

      // Trying to create a post
      const response = await postCreator(
        blogsURI + blogId + postsURI,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when updating post with incorrect credentials", async () => {
      const response = await postUpdater(
        undefined,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when deleting post with incorrect credentials", async () => {
      const postId = await firstPostId();
      const response = await eraserWithId(postsURI, postId, invalidAuthValue);
      expect(response.status).toBe(401);
    });
  });
  describe("Posts status 404 checks", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should return 404 when getting nonexistent post", async () => {
      const response = await getter(postsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when updating nonexistent post", async () => {
      const response = await blogUpdater(postsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when deleting nonexistent post", async () => {
      const response = await eraser(postsURI + invalidURI);
      expect(response.status).toBe(404);
    });
  });
  describe("Posts CRUD operations", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should return all posts", async () => {
      const response = await getter(postsURI);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyOutput);
    });
    it("should create new post", async () => {
      // Trying to create a post
      const response = await postCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const post = await firstPost();
      const returnedPost = await postReturner();
      expect(post).toStrictEqual(returnedPost);
    });
    it("should update post", async () => {
      // Trying to update a post
      const response = await postUpdater();
      expect(response.status).toBe(204);
    });
    it("should return post by ID with updated data", async () => {
      // Trying to get post by ID
      const postId = await firstPostId();
      const response = await getterWithId(postsURI, postId);
      expect(response.status).toBe(200);

      // Checking result by returning updated post
      const post = await firstPost();
      const returnedPost = await postReturner(
        undefined,
        postNewTitleString,
        postNewShortDescriptionString,
        postNewContentString
      );
      expect(post).toStrictEqual(returnedPost);
    });
    it("should delete post by ID", async () => {
      // Trying to delete post
      const postId = await firstPostId();
      const response = await eraserWithId(postsURI, postId);
      expect(response.status).toBe(204);

      // Checking result by returning posts array length
      const length = await postsLength();
      expect(length).toBe(0);
    });
  });
  describe("Posts inside blog CR operations", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should create new post for exact blog", async () => {
      // Finding blogId
      const blogId = await firstBlogId();

      // Trying to create a post
      const response = await postCreator(blogsURI + blogId + postsURI);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const post = await firstPost();
      const returnedPost = await postReturner();
      expect(post).toStrictEqual(returnedPost);

      // Checking that post is available through blog URI param
      const check = await getter(blogsURI + blogId);
      expect(check.status).toBe(200);
      expect(post).toStrictEqual(returnedPost);
    });
  });
  describe("Posts sorting", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should sort posts by any field (title for testing)", async () => {
      // Trying to create 5 posts
      await postCreator(undefined, sortingString07);
      await postCreator(undefined, sortingString02);
      await postCreator(undefined, sortingString04);
      await postCreator(undefined, sortingString05);
      const lastBlogResponse = await postCreator(undefined, sortingString09);

      expect(lastBlogResponse.status).toBe(201);

      // Checking result by returning blogs array length
      const length = await postsLength();
      expect(length).toBe(5);

      const response = await getter(postsURI);
      expect(response.status).toBe(200);

      // Applying and checking descending sorting
      const postsWithQueryDesc = await findPosts(undefined, undefined, "title");
      expect(postsWithQueryDesc.items[0].title).toBe(sortingString09);
      expect(postsWithQueryDesc.items[1].title).toBe(sortingString07);
      expect(postsWithQueryDesc.items[2].title).toBe(sortingString05);
      expect(postsWithQueryDesc.items[3].title).toBe(sortingString04);
      expect(postsWithQueryDesc.items[4].title).toBe(sortingString02);

      // Applying and checking descending sorting
      const postsWithQueryAsc = await findPosts(
        undefined,
        undefined,
        "title",
        "asc"
      );
      expect(postsWithQueryAsc.items[0].title).toBe(sortingString02);
      expect(postsWithQueryAsc.items[1].title).toBe(sortingString04);
      expect(postsWithQueryAsc.items[2].title).toBe(sortingString05);
      expect(postsWithQueryAsc.items[3].title).toBe(sortingString07);
      expect(postsWithQueryAsc.items[4].title).toBe(sortingString09);
    });
  });
  describe("Posts pagination", () => {
    beforeAll(eraseAll);
    it("should create new blog for testing", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should return correct posts pagination output", async () => {
      // Trying to create 20 posts
      let i = 0;
      while (i < 20) {
        const response = await postCreator(undefined, `Test title ${i}`);
        expect(response.status).toBe(201);
        i++;
      }

      // Checking pagination
      const check = await getter(postsURI);
      expect(check.status).toBe(200);
      const postsWithQuery = await findPosts(2, 5);
      expect(postsWithQuery.pagesCount).toBe(4);
      expect(postsWithQuery.page).toBe(2);
      expect(postsWithQuery.pageSize).toBe(5);
      expect(postsWithQuery.totalCount).toBe(20);
      expect(postsWithQuery.items.length).toBe(5);
    }, 30000);
  });
});