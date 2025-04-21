import {
  blogCreator,
  blogReturner,
  blogsLength,
  blogUpdater,
  eraseAll,
  eraser,
  eraserWithId,
  findBlogs,
  firstBlog,
  firstBlogId,
  getter,
  getterWithId,
} from "../../test-utils/test-functions";
import {
  blogFilterString01,
  blogFilterString02,
  blogFilterString03,
  blogFilterString04,
  blogFilterString05,
  blogNewDescriptionString,
  blogNewNameString,
  blogNewWebsiteUrlString,
  blogsURI,
  invalidAuthValue,
  invalidURI,
  longString109,
  longString17,
  longString508,
  postsURI,
  sortingString02,
  sortingString04,
  sortingString05,
  sortingString07,
  sortingString09,
} from "../../test-utils/test-strings";
import { emptyOutput } from "../../test-utils/test-objects";

describe("Blogs testing", () => {
  describe("Blogs status 400 checks", () => {
    beforeAll(eraseAll);
    it("should NOT create new blog without name", async () => {
      // Trying to create a blog without name
      const response = await blogCreator(undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect name type", async () => {
      // Trying to create a blog with incorrect name type
      const response = await blogCreator(undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect name length", async () => {
      // Trying to create a blog with incorrect name length
      const response = await blogCreator(undefined, longString17);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog without description", async () => {
      // Trying to create a blog without description
      const response = await blogCreator(undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect description type", async () => {
      // Trying to create a blog with incorrect description type
      const response = await blogCreator(undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect description length", async () => {
      // Trying to create a blog with incorrect description length
      const response = await blogCreator(undefined, undefined, longString508);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog without website URL", async () => {
      // Trying to create a blog without website URL
      const response = await blogCreator(undefined, undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect website URL type", async () => {
      // Trying to create a blog with incorrect website URL type
      const response = await blogCreator(undefined, undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect website URL length", async () => {
      // Trying to create a blog with incorrect website URL length
      const response = await blogCreator(
        undefined,
        undefined,
        undefined,
        longString109
      );
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new blog with incorrect website URL format", async () => {
      // Trying to create a blog with incorrect website URL format
      const response = await blogCreator(
        undefined,
        undefined,
        undefined,
        longString17
      );
      expect(response.status).toBe(400);

      // Checking result
      const length = await blogsLength();
      expect(length).toBe(0);
    });
  });
  describe("Blogs status 401 checks", () => {
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
    it("should return 401 when creating blog with incorrect credentials", async () => {
      const response = await blogCreator(
        undefined,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when updating blog with incorrect credentials", async () => {
      const response = await blogUpdater(
        undefined,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when deleting blog with incorrect credentials", async () => {
      const blogId = await firstBlogId();
      const response = await eraserWithId(blogsURI, blogId, invalidAuthValue);
      expect(response.status).toBe(401);
    });
  });
  describe("Blogs status 404 checks", () => {
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
    it("should return 404 when getting nonexistent blog", async () => {
      const response = await getter(blogsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when getting posts of nonexistent blog", async () => {
      const response = await getter(blogsURI + invalidURI + postsURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when updating nonexistent blog", async () => {
      const response = await blogUpdater(blogsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when deleting nonexistent blog", async () => {
      const response = await eraser(blogsURI + invalidURI);
      expect(response.status).toBe(404);
    });
  });
  describe("Blogs CRUD operations", () => {
    beforeAll(eraseAll);
    it("should return all blogs", async () => {
      const response = await getter(blogsURI);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyOutput);
    });
    it("should create new blog", async () => {
      // Trying to create a blog
      const response = await blogCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner();
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should update blog", async () => {
      // Trying to update a blog
      const response = await blogUpdater();
      expect(response.status).toBe(204);
    });
    it("should return blog by ID with updated data", async () => {
      // Trying to get blog by ID
      const blogId = await firstBlogId();
      const response = await getterWithId(blogsURI, blogId);
      expect(response.status).toBe(200);

      // Checking result by returning updated blog
      const blog = await firstBlog();
      const returnedBlog = await blogReturner(
        undefined,
        blogNewNameString,
        blogNewDescriptionString,
        blogNewWebsiteUrlString
      );
      expect(blog).toStrictEqual(returnedBlog);
    });
    it("should delete blog by ID", async () => {
      // Trying to delete a blog
      const blogId = await firstBlogId();
      const response = await eraserWithId(blogsURI, blogId, invalidAuthValue);
      expect(response.status).toBe(401);
    });
  });
  describe("Blogs name filtering", () => {
    beforeAll(eraseAll);
    it("should return blogs with filter", async () => {
      // Trying to create 5 blogs
      await blogCreator(undefined, blogFilterString01);
      await blogCreator(undefined, blogFilterString02);
      await blogCreator(undefined, blogFilterString03);
      await blogCreator(undefined, blogFilterString04);
      const lastBlogResponse = await blogCreator(undefined, blogFilterString05);

      expect(lastBlogResponse.status).toBe(201);

      // Checking result by returning blogs array length
      const length = await blogsLength();
      expect(length).toBe(5);

      // Applying and checking filter

      const response = await getter(blogsURI);
      expect(response.status).toBe(200);

      const blogsWithQuery = await findBlogs(
        undefined,
        undefined,
        undefined,
        undefined,
        "va"
      );
      expect(blogsWithQuery.totalCount).toBe(3);
      expect(blogsWithQuery.items.length).toBe(3);

      // Default sorting for blogs ==> createdAt, desc
      expect(blogsWithQuery.items[0].name).toBe(blogFilterString03);
      expect(blogsWithQuery.items[1].name).toBe(blogFilterString02);
      expect(blogsWithQuery.items[2].name).toBe(blogFilterString01);
    });
  });
  describe("Blogs sorting", () => {
    beforeAll(eraseAll);
    it("should sort blogs by any field (name for testing)", async () => {
      // Trying to create 5 blogs
      await blogCreator(undefined, sortingString07);
      await blogCreator(undefined, sortingString02);
      await blogCreator(undefined, sortingString04);
      await blogCreator(undefined, sortingString05);
      const lastBlogResponse = await blogCreator(undefined, sortingString09);

      expect(lastBlogResponse.status).toBe(201);

      // Checking result by returning blogs array length
      const length = await blogsLength();
      expect(length).toBe(5);

      const response = await getter(blogsURI);
      expect(response.status).toBe(200);

      // Applying and checking descending sorting
      const blogsWithQueryDesc = await findBlogs(undefined, undefined, "name");
      expect(blogsWithQueryDesc.items[0].name).toBe(sortingString09);
      expect(blogsWithQueryDesc.items[1].name).toBe(sortingString07);
      expect(blogsWithQueryDesc.items[2].name).toBe(sortingString05);
      expect(blogsWithQueryDesc.items[3].name).toBe(sortingString04);
      expect(blogsWithQueryDesc.items[4].name).toBe(sortingString02);

      // Applying and checking ascending sorting
      const blogsWithQueryAsc = await findBlogs(
        undefined,
        undefined,
        "name",
        "asc"
      );
      expect(response.status).toBe(200);
      expect(blogsWithQueryAsc.items[0].name).toBe(sortingString02);
      expect(blogsWithQueryAsc.items[1].name).toBe(sortingString04);
      expect(blogsWithQueryAsc.items[2].name).toBe(sortingString05);
      expect(blogsWithQueryAsc.items[3].name).toBe(sortingString07);
      expect(blogsWithQueryAsc.items[4].name).toBe(sortingString09);
    });
  });
  describe("Blogs pagination", () => {
    beforeAll(eraseAll);
    it("should return correct blogs pagination output", async () => {
      // Trying to create 20 blogs
      let i = 0;
      while (i < 20) {
        const response = await blogCreator(undefined, `Test name ${i}`);
        expect(response.status).toBe(201);
        i++;
      }

      // Checking pagination
      const check = await getter(blogsURI);
      expect(check.status).toBe(200);

      const blogsWithQuery = await findBlogs(2, 5);
      expect(blogsWithQuery.pagesCount).toBe(4);
      expect(blogsWithQuery.page).toBe(2);
      expect(blogsWithQuery.pageSize).toBe(5);
      expect(blogsWithQuery.totalCount).toBe(20);
      expect(blogsWithQuery.items.length).toBe(5);
    }, 30000);
  });
});