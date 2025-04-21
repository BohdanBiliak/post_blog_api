import {
  authentication,
  blogCreator,
  blogReturner,
  commentCreator,
  commentReturner,
  eraseAll,
  firstBlog,
  firstComment,
  firstPost,
  firstUser,
  getter,
  getterWithId,
  getterWithIdBearer,
  likesUpdater,
  postCreator,
  postReturner,
  userCreator,
  userReturner,
  usersLength,
} from "../../test-utils/test-functions";
import {
  commentsURI,
  dislikeString,
  likeString,
  longString17,
  noneString,
  postsURI,
  userEmailFilterString01,
  userEmailFilterString02,
  userEmailFilterString03,
  userEmailFilterString04,
  userLoginFilterString01,
  userLoginFilterString02,
  userLoginFilterString03,
  userLoginFilterString04,
} from "../../test-utils/test-strings";

describe("Likes testing", () => {
  describe("Likes status 400-401-404 checks", () => {
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

    let accessToken: string;

    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);
      accessToken = loginResponse.body.accessToken;
    });

    let commentId: string;

    it("should create new comment", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(accessToken);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const comment = await firstComment();
      const returnedComment = await commentReturner();
      expect(comment).toStrictEqual(returnedComment);

      commentId = comment.id;
    });
    it("should NOT update like status with incorrect data", async () => {
      // Trying to update like status with incorrect data
      const response = await likesUpdater(accessToken, commentId, longString17);
      expect(response.status).toBe(400);

      // Checking result
      const checkResponse = await getterWithId(commentsURI, commentId);
      expect(checkResponse.body.likesInfo.myStatus).toBe(noneString);
    });
    it("should NOT update like status with incorrect credentials", async () => {
      // Trying to update like status with incorrect data
      const response = await likesUpdater(longString17, commentId, likeString);
      expect(response.status).toBe(401);

      // Checking result
      const checkResponse = await getterWithId(commentsURI, commentId);
      expect(checkResponse.body.likesInfo.myStatus).toBe(noneString);
    });
    it("should NOT update like status with incorrect comment ID", async () => {
      // Trying to update like status with incorrect data
      const response = await likesUpdater(
        accessToken,
        longString17,
        likeString
      );
      expect(response.status).toBe(404);

      // Checking result
      const checkResponse = await getterWithId(commentsURI, commentId);
      expect(checkResponse.body.likesInfo.myStatus).toBe(noneString);
    });
  });
  describe("Likes testing 01", () => {
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
    it("should create users for testing", async () => {
      await userCreator(
        undefined,
        userLoginFilterString01,
        undefined,
        userEmailFilterString01
      );
      await userCreator(
        undefined,
        userLoginFilterString02,
        undefined,
        userEmailFilterString02
      );
      const lastUserResponse = await userCreator(
        undefined,
        userLoginFilterString03,
        undefined,
        userEmailFilterString03
      );

      expect(lastUserResponse.status).toBe(201);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(3);
    });

    let firstAccessToken: string;
    let accessToken: string;

    it("should log in user 1", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString01
      );
      expect(loginResponse.status).toBe(200);
      firstAccessToken = loginResponse.body.accessToken;
    });

    let commentId: string;

    it("should create new comment", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(firstAccessToken);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const comment = await firstComment();

      commentId = comment.id;
    });
    it("should dislike comment by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentId,
        dislikeString
      );
      expect(response.status).toBe(204);

      // Checking result
      const checkResponse = await getterWithIdBearer(
        commentsURI,
        commentId,
        firstAccessToken
      );

      expect(checkResponse.body.likesInfo.myStatus).toBe(dislikeString);
    });
    it("should log in user 2", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString02
      );
      expect(loginResponse.status).toBe(200);
      accessToken = loginResponse.body.accessToken;
    });
    it("should dislike comment by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        accessToken,
        commentId,
        dislikeString
      );
      expect(response.status).toBe(204);

      // Checking result
      const checkResponse = await getterWithIdBearer(
        commentsURI,
        commentId,
        firstAccessToken
      );

      expect(checkResponse.body.likesInfo.myStatus).toBe(dislikeString);
    });
    it("should log in user 3", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString03
      );
      expect(loginResponse.status).toBe(200);
      accessToken = loginResponse.body.accessToken;
    });
    it("should like comment by user 3", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(accessToken, commentId, likeString);
      expect(response.status).toBe(204);

      // Checking result
      const checkResponse = await getterWithIdBearer(
        commentsURI,
        commentId,
        firstAccessToken
      );

      expect(checkResponse.body.likesInfo.myStatus).toBe(dislikeString);
      expect(checkResponse.body.likesInfo.likesCount).toBe(1);
      expect(checkResponse.body.likesInfo.dislikesCount).toBe(2);
    });
  });
  describe("Likes testing 02", () => {
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
    it("should create users for testing", async () => {
      await userCreator(
        undefined,
        userLoginFilterString01,
        undefined,
        userEmailFilterString01
      );
      await userCreator(
        undefined,
        userLoginFilterString02,
        undefined,
        userEmailFilterString02
      );
      const lastUserResponse = await userCreator(
        undefined,
        userLoginFilterString03,
        undefined,
        userEmailFilterString03
      );

      expect(lastUserResponse.status).toBe(201);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(3);
    });

    let firstAccessToken: string;
    let secondAccessToken: string;

    it("should log in user 1", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString01
      );
      expect(loginResponse.status).toBe(200);
      firstAccessToken = loginResponse.body.accessToken;
    });

    let commentId: string;

    it("should create new comment", async () => {
      // Trying to create comment with authenticated user
      const response = await commentCreator(firstAccessToken);
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const comment = await firstComment();

      commentId = comment.id;
    });
    it("should like comment by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should log in user 2 and check previous", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString02
      );
      expect(loginResponse.status).toBe(200);
      secondAccessToken = loginResponse.body.accessToken;

      // Checking previous result
      const checkResponse = await getterWithIdBearer(
        commentsURI,
        commentId,
        secondAccessToken
      );
      expect(checkResponse.body.likesInfo.myStatus).toBe(noneString);
      expect(checkResponse.body.likesInfo.likesCount).toBe(1);
    });
    it("should dislike comment by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentId,
        dislikeString
      );
      expect(response.status).toBe(204);
    });
    it("should log in user 1 and check previous", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString01
      );
      expect(loginResponse.status).toBe(200);
      firstAccessToken = loginResponse.body.accessToken;

      // Checking previous result
      const checkResponse = await getterWithIdBearer(
        commentsURI,
        commentId,
        firstAccessToken
      );

      expect(checkResponse.body.likesInfo.likesCount).toBe(1);
      expect(checkResponse.body.likesInfo.dislikesCount).toBe(1);
      expect(checkResponse.body.likesInfo.myStatus).toBe(likeString);
    });
  });
  describe("Likes testing 03", () => {
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

    let postId: string;

    it("should create new post for testing", async () => {
      // Trying to create a post
      const response = await postCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created post
      const post = await firstPost();
      const returnedPost = await postReturner();
      postId = post.id;
      expect(post).toStrictEqual(returnedPost);
    });
    it("should create users for testing", async () => {
      await userCreator(
        undefined,
        userLoginFilterString01,
        undefined,
        userEmailFilterString01
      );
      await userCreator(
        undefined,
        userLoginFilterString02,
        undefined,
        userEmailFilterString02
      );
      await userCreator(
        undefined,
        userLoginFilterString03,
        undefined,
        userEmailFilterString03
      );
      const lastUserResponse = await userCreator(
        undefined,
        userLoginFilterString04,
        undefined,
        userEmailFilterString04
      );

      expect(lastUserResponse.status).toBe(201);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(4);
    });

    let firstAccessToken: string;
    let secondAccessToken: string;
    let thirdAccessToken: string;
    let fourthAccessToken: string;

    it("should log in user 1", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString01
      );
      expect(loginResponse.status).toBe(200);
      firstAccessToken = loginResponse.body.accessToken;
    });

    let commentOneId: string;
    let commentTwoId: string;
    let commentThreeId: string;
    let commentFourId: string;
    let commentFiveId: string;
    let commentSixId: string;

    it("should create 6 comments", async () => {
      // Trying to create 6 comments
      let i = 0;
      while (i < 6) {
        await commentCreator(firstAccessToken);
        i++;
      }
      const response = await getter(postsURI + postId + commentsURI);
      expect(response.body.items.length).toBe(6);
      commentOneId = response.body.items[0].id;
      commentTwoId = response.body.items[1].id;
      commentThreeId = response.body.items[2].id;
      commentFourId = response.body.items[3].id;
      commentFiveId = response.body.items[4].id;
      commentSixId = response.body.items[5].id;
    });
    it("should like comment 1 by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentOneId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should log in user 2", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString02
      );
      expect(loginResponse.status).toBe(200);
      secondAccessToken = loginResponse.body.accessToken;
    });
    it("should like comment 1 by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentOneId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 2 by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentTwoId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should log in user 3", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString03
      );
      expect(loginResponse.status).toBe(200);
      thirdAccessToken = loginResponse.body.accessToken;
    });
    it("should like comment 2 by user 3", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        thirdAccessToken,
        commentTwoId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should dislike comment 3 by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentThreeId,
        dislikeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 4 by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentFourId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should log in user 4", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication(
        undefined,
        userLoginFilterString04
      );
      expect(loginResponse.status).toBe(200);
      fourthAccessToken = loginResponse.body.accessToken;
    });
    it("should like comment 4 by user 4", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        fourthAccessToken,
        commentFourId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 4 by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentFourId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 4 by user 3", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        thirdAccessToken,
        commentFourId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 5 by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentFiveId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should dislike comment 5 by user 3", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        thirdAccessToken,
        commentFiveId,
        dislikeString
      );
      expect(response.status).toBe(204);
    });
    it("should like comment 6 by user 1", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        firstAccessToken,
        commentSixId,
        likeString
      );
      expect(response.status).toBe(204);
    });
    it("should dislike comment 6 by user 2", async () => {
      // Trying to update like status with correct data
      const response = await likesUpdater(
        secondAccessToken,
        commentSixId,
        dislikeString
      );
      expect(response.status).toBe(204);
    });
    it("should return correct likes / dislikes counters values", async () => {
      // Checking results
      const checkCommentOne = await getterWithIdBearer(
          commentsURI,
          commentOneId,
          firstAccessToken
      );

      expect(checkCommentOne.body.likesInfo.likesCount).toBe(2);
      expect(checkCommentOne.body.likesInfo.dislikesCount).toBe(0);

      const checkCommentTwo = await getterWithIdBearer(
          commentsURI,
          commentTwoId,
          firstAccessToken
      );

      expect(checkCommentTwo.body.likesInfo.likesCount).toBe(2);
      expect(checkCommentTwo.body.likesInfo.dislikesCount).toBe(0);

      const checkCommentThree = await getterWithIdBearer(
          commentsURI,
          commentThreeId,
          firstAccessToken
      );

      expect(checkCommentThree.body.likesInfo.likesCount).toBe(0);
      expect(checkCommentThree.body.likesInfo.dislikesCount).toBe(1);

      const checkCommentFour = await getterWithIdBearer(
          commentsURI,
          commentFourId,
          firstAccessToken
      );

      expect(checkCommentFour.body.likesInfo.likesCount).toBe(4);
      expect(checkCommentFour.body.likesInfo.dislikesCount).toBe(0);

      const checkCommentFive = await getterWithIdBearer(
          commentsURI,
          commentFiveId,
          firstAccessToken
      );

      expect(checkCommentFive.body.likesInfo.likesCount).toBe(1);
      expect(checkCommentFive.body.likesInfo.dislikesCount).toBe(1);

      const checkCommentSix = await getterWithIdBearer(
          commentsURI,
          commentSixId,
          firstAccessToken
      );

      expect(checkCommentSix.body.likesInfo.likesCount).toBe(1);
      expect(checkCommentSix.body.likesInfo.dislikesCount).toBe(1);
    });



  });
});