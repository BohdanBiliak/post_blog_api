import {
  authentication,
  blogCreator,
  blogReturner,
  commentCreator,
  commentCreatorSecondPost,
  commentReturner,
  commentsLength,
  commentsOfSecondPostLength,
  commentUpdater,
  eraseAll,
  eraser,
  eraserWithIdBearer,
  findComments,
  firstBlog,
  firstComment,
  firstCommentId,
  firstPost,
  firstPostId,
  firstUser,
  getter,
  getterWithId,
  invalidCommentCreator,
  invalidCommentUpdater,
  postCreator,
  postReturner,
  postsLength,
  secondPost,
  secondPostId,
  userCreator,
  userReturner,
} from "../../test-utils/test-functions";
import {
  basicAuthKey,
  commentContentString,
  commentContentString01,
  commentContentString02,
  commentContentString03,
  commentContentString04,
  commentContentString05,
  commentNewContentString,
  commentsURI,
  invalidAuthValue,
  invalidURI,
  longString17,
  postsURI,
} from "../../test-utils/test-strings";
import request from "supertest";
import { app } from "../../src";

describe("Comments testing", () => {
  describe("Comments status 400 checks", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);
      token = loginResponse.body.accessToken;
    });
    it("should NOT create new comment without content", async () => {
      // Trying to create comment without content
      const response = await commentCreator(token, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await commentsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new comment with incorrect content type", async () => {
      // Trying to create comment with incorrect content type
      const response = await commentCreator(token, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await commentsLength();
      expect(length).toBe(0);
    });
    it("should NOT create new comment with incorrect content length", async () => {
      // Trying to create comment with incorrect content length
      const response = await commentCreator(token, longString17);
      expect(response.status).toBe(400);

      // Checking result
      const length = await commentsLength();
      expect(length).toBe(0);
    });
  });
  describe("Comments status 401 checks", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should create new comment for testing", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(token);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const comment = await firstComment();
      const returnedComment = await commentReturner();
      expect(comment).toStrictEqual(returnedComment);
    });
    it("should return 401 when creating comment with incorrect credentials", async () => {
      const postId = await firstPostId();
      const response = await request(app)
        .post(postsURI + postId + commentsURI)
        .send({
          commentContentString,
        })
        .set(basicAuthKey, invalidAuthValue);
      expect(response.status).toBe(401);
    });
    it("should return 401 when updating comment with incorrect credentials", async () => {
      const commentId = await firstCommentId();
      const response = await request(app)
        .put(commentsURI + commentId)
        .send({
          commentContentString,
        })
        .set(basicAuthKey, invalidAuthValue);
      expect(response.status).toBe(401);
    });
    it("should return 401 when deleting comment with incorrect credentials", async () => {
      const commentId = await firstCommentId();
      const response = await request(app)
        .delete(commentsURI + commentId)
        .set(basicAuthKey, invalidAuthValue);
      expect(response.status).toBe(401);
    });
  });
  describe("Comments status 403 checks", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should create new villain user for testing", async () => {
      // Trying to create user
      const response = await userCreator(
        undefined,
        "Villain",
        undefined,
        "villain@hacker.com"
      );
      expect(response.status).toBe(201);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should create new comment for testing", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(token);
      expect(response.status).toBe(201);
    });
    it("should return 403 when updating comment with incorrect token", async () => {
      const response = await commentUpdater(undefined, "Villain");
      expect(response.status).toBe(403);
    });
    it("should return 403 when deleting comment with incorrect token", async () => {
      const commentId = await firstCommentId();
      const response = await eraserWithIdBearer(
        commentsURI,
        commentId,
        "Villain"
      );
      expect(response.status).toBe(403);
    });
  });
  describe("Comments status 404 checks", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should return 404 when getting comments of nonexistent post", async () => {
      const response = await getter(postsURI + invalidURI + commentsURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when creating comment of nonexistent post", async () => {
      const response = await invalidCommentCreator();
      expect(response.status).toBe(404);
    });
    it("should return 404 when getting nonexistent comment", async () => {
      const response = await getter(commentsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when updating nonexistent comment", async () => {
      const response = await invalidCommentUpdater(commentsURI + invalidURI);
      expect(response.status).toBe(404);
    });
    it("should return 404 when deleting nonexistent comment", async () => {
      const response = await eraser(commentsURI + invalidURI);
      expect(response.status).toBe(404);
    });
  });
  describe("Comments CRUD operations", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should create new comment", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(token);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const comment = await firstComment();
      const returnedComment = await commentReturner();
      expect(comment).toStrictEqual(returnedComment);
    });
    it("should update comment", async () => {
      // Trying to update comment
      const response = await commentUpdater();
      expect(response.status).toBe(204);
    });
    it("should return comment by ID with updated data", async () => {
      // Trying to get comment by ID
      const commentId = await firstCommentId();
      const response = await getterWithId(commentsURI, commentId);
      expect(response.status).toBe(200);

      // Checking result by returning updated post
      const comment = await firstComment();
      const returnedComment = await commentReturner(
        undefined,
        commentNewContentString
      );
      expect(comment).toStrictEqual(returnedComment);
    });
    it("should delete comment by ID", async () => {
      // Trying to delete comment
      const commentId = await firstCommentId();
      const response = await eraserWithIdBearer(commentsURI, commentId);
      expect(response.status).toBe(204);

      // Checking result by returning blogs array length
      const length = await commentsLength();
      expect(length).toBe(0);
    });
  });
  describe("Comments filtering by post (return all comments)", () => {
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
    it("should create two posts for testing", async () => {
      // Trying to create two posts
      let i = 0;
      while (i < 2) {
        const response = await postCreator();
        i++;
        expect(response.status).toBe(201);
      }

      // Checking result by returning created posts
      const postOne = await firstPost();
      const postTwo = await secondPost();
      const returnedPost = await postReturner();
      expect(postOne).toStrictEqual(returnedPost);
      expect(postTwo).toStrictEqual(returnedPost);

      const length = await postsLength();
      expect(length).toBe(2);
    });
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    let token: string;
    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should create new comments for posts", async () => {
      // Trying to create 4 comments for first post
      let i = 0;
      while (i < 4) {
        const response = await commentCreator(token);
        expect(response.status).toBe(201);
        i++;
      }

      // Trying to create 3 comments for second post
      let j = 0;
      while (j < 3) {
        const response = await commentCreatorSecondPost();
        expect(response.status).toBe(201);
        j++;
      }

      // Trying to return comments for first post
      const firstPost = await firstPostId();
      const responseOne = await getter(postsURI + firstPost + commentsURI);
      expect(responseOne.status).toBe(200);

      // Trying to return comments for second post
      const secondPost = await secondPostId();
      const responseTwo = await getter(postsURI + secondPost + commentsURI);
      expect(responseTwo.status).toBe(200);

      const lengthOfPostOne = await commentsLength();
      expect(lengthOfPostOne).toBe(4);

      const lengthOfPostTwo = await commentsOfSecondPostLength();
      expect(lengthOfPostTwo).toBe(3);
    }, 30000);
  });
  describe("Comments sorting", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should sort comments by any field (content for testing)", async () => {
      // Trying to create 5 comments
      await commentCreator(token, commentContentString01);
      await commentCreator(token, commentContentString02);
      await commentCreator(token, commentContentString03);
      await commentCreator(token, commentContentString04);
      const lastCommentResponse = await commentCreator(
        token,
        commentContentString05
      );

      expect(lastCommentResponse.status).toBe(201);

      // Checking result by returning comments array length
      const length = await commentsLength();
      expect(length).toBe(5);

      const firstPost = await firstPostId();
      const response = await getter(postsURI + firstPost + commentsURI);
      expect(response.status).toBe(200);

      // Applying and checking descending sorting
      const CommentsWithQueryDesc = await findComments(
        undefined,
        undefined,
        "content"
      );
      expect(CommentsWithQueryDesc.items[0].content).toBe(
        commentContentString02
      );
      expect(CommentsWithQueryDesc.items[1].content).toBe(
        commentContentString05
      );
      expect(CommentsWithQueryDesc.items[2].content).toBe(
        commentContentString01
      );
      expect(CommentsWithQueryDesc.items[3].content).toBe(
        commentContentString03
      );
      expect(CommentsWithQueryDesc.items[4].content).toBe(
        commentContentString04
      );

      // Applying and checking ascending sorting
      const CommentsWithQueryAsc = await findComments(
        undefined,
        undefined,
        "content",
        "asc"
      );
      expect(CommentsWithQueryAsc.items[0].content).toBe(
        commentContentString04
      );
      expect(CommentsWithQueryAsc.items[1].content).toBe(
        commentContentString03
      );
      expect(CommentsWithQueryAsc.items[2].content).toBe(
        commentContentString01
      );
      expect(CommentsWithQueryAsc.items[3].content).toBe(
        commentContentString05
      );
      expect(CommentsWithQueryAsc.items[4].content).toBe(
        commentContentString02
      );
    });
  });
  describe("Comments pagination", () => {
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
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });

    let token: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      token = loginResponse.body.accessToken;
    });
    it("should return correct comments pagination output", async () => {
      // Trying to create 20 comments
      let i = 0;
      while (i < 20) {
        const response = await commentCreator(token);
        expect(response.status).toBe(201);
        i++;
      }

      // Checking pagination
      const firstPost = await firstPostId();
      const response = await getter(postsURI + firstPost + commentsURI);
      expect(response.status).toBe(200);

      const commentsWithQuery = await findComments(2, 5);
      expect(commentsWithQuery.pagesCount).toBe(4);
      expect(commentsWithQuery.page).toBe(2);
      expect(commentsWithQuery.pageSize).toBe(5);
      expect(commentsWithQuery.totalCount).toBe(20);
      expect(commentsWithQuery.items.length).toBe(5);
    }, 30000);
  });
});