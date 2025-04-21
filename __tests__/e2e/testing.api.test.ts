import {
  authentication,
  blogCreator,
  blogReturner,
  commentCreator,
  commentReturner,
  eraseAll,
  eraser,
  firstBlog,
  firstComment,
  firstPost,
  firstUser,
  getter,
  getterWithCookie,
  postCreator,
  postReturner,
  userCreator,
  userReturner,
} from "../../test-utils/test-functions";
import {
  blogsURI,
  devicesURI,
  postsURI,
  testingURI,
  usersURI,
} from "../../test-utils/test-strings";

describe("Testing delete operation", () => {
  beforeAll(eraseAll);
  it("should create new blog", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
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
  it("should create new user", async () => {
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
  it("should create new device", async () => {
    // Authenticating user
    const authResponse = await authentication();

    // Finding cookie
    const refreshToken = authResponse.headers["set-cookie"][0];

    // Checking devices
    const response = await getterWithCookie(devicesURI, refreshToken);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
  it("should delete everything", async () => {
    // Authenticating user
    const authResponse = await authentication();

    // Finding cookie
    const refreshToken = authResponse.headers["set-cookie"][0];

    // Trying to delete everything
    const response = await eraser(testingURI);
    expect(response.status).toBe(204);

    // Checking users
    const usersResponse = await getter(usersURI);
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body.items.length).toBe(0);

    // Checking devices
    const devicesResponse = await getterWithCookie(devicesURI, refreshToken);
    expect(devicesResponse.status).toBe(200);
    expect(devicesResponse.body.length).toBe(0);

    // Checking posts
    const postsResponse = await getter(postsURI);
    expect(postsResponse.status).toBe(200);
    expect(postsResponse.body.items.length).toBe(0);

    // Checking blogs
    const blogsResponse = await getter(blogsURI);
    expect(blogsResponse.status).toBe(200);
    expect(blogsResponse.body.items.length).toBe(0);
  });
});