import {
  eraseAll,
  eraser,
  eraserWithId,
  findUsers,
  firstUser,
  firstUserId,
  getter,
  getterWithInvalidCredentials,
  userCreator,
  userReturner,
  usersLength,
} from "../../test-utils/test-functions";
import {
  invalidAuthValue,
  invalidURI,
  longString17,
  longString39,
  spaceString,
  userEmailFilterString01,
  userEmailFilterString02,
  userEmailFilterString03,
  userEmailFilterString04,
  userEmailFilterString05,
  userLoginFilterString01,
  userLoginFilterString02,
  userLoginFilterString03,
  userLoginFilterString04,
  userLoginFilterString05,
  usersURI,
} from "../../test-utils/test-strings";
import { emptyOutput } from "../../test-utils/test-objects";

describe("Users testing", () => {
  describe("Users status 400 checks", () => {
    beforeAll(eraseAll);
    it("should NOT create new user without login", async () => {
      // Trying to create user without login
      const response = await userCreator(undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect login type", async () => {
      // Trying to create user with incorrect name type
      const response = await userCreator(undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect login length", async () => {
      // Trying to create user with incorrect login length
      const response = await userCreator(undefined, longString17);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect login format", async () => {
      // Trying to create login with incorrect website URL format
      const response = await userCreator(undefined, spaceString);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user without password", async () => {
      // Trying to create user without password
      const response = await userCreator(undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect password type", async () => {
      // Trying to create a user with incorrect password type
      const response = await userCreator(undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect password length", async () => {
      // Trying to create a user with incorrect password length
      const response = await userCreator(undefined, undefined, longString39);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user without email", async () => {
      // Trying to create user without email
      const response = await userCreator(undefined, undefined, undefined, null);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect email type", async () => {
      // Trying to create user with incorrect email type
      const response = await userCreator(undefined, undefined, undefined, 123);
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
    it("should NOT create new user with incorrect email format", async () => {
      // Trying to create user with incorrect email format
      const response = await userCreator(
        undefined,
        undefined,
        undefined,
        spaceString
      );
      expect(response.status).toBe(400);

      // Checking result
      const length = await usersLength();
      expect(length).toBe(0);
    });
  });
  describe("Users status 401 checks", () => {
    beforeAll(eraseAll);
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should return 401 when getting users with incorrect credentials", async () => {
      const response = await getterWithInvalidCredentials(usersURI);
      expect(response.status).toBe(401);
    });
    it("should return 401 when creating user with incorrect credentials", async () => {
      const response = await userCreator(
        undefined,
        undefined,
        undefined,
        undefined,
        invalidAuthValue
      );
      expect(response.status).toBe(401);
    });
    it("should return 401 when deleting user with incorrect credentials", async () => {
      const userId = await firstUserId();
      const response = await eraserWithId(usersURI, userId, invalidAuthValue);
      expect(response.status).toBe(401);
    });
  });
  describe("Users status 404 checks", () => {
    beforeAll(eraseAll);
    it("should create new user for testing", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should return 404 when deleting nonexistent user", async () => {
      const response = await eraser(usersURI + invalidURI);
      expect(response.status).toBe(404);
    });
  });
  describe("Users CRD operations", () => {
    beforeAll(eraseAll);
    it("should return all users", async () => {
      const response = await getter(usersURI);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(emptyOutput);
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
    it("should delete user by ID", async () => {
      // Trying to delete user
      const userId = await firstUserId();
      const response = await eraserWithId(usersURI, userId);
      expect(response.status).toBe(204);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(0);
    });
  });
  describe("Users login and email filtering", () => {
    beforeAll(eraseAll);
    it("should return users with login filter", async () => {
      // Trying to create 5 users
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
      await userCreator(
        undefined,
        userLoginFilterString04,
        undefined,
        userEmailFilterString04
      );
      const lastUserResponse = await userCreator(
        undefined,
        userLoginFilterString05,
        undefined,
        userEmailFilterString05
      );

      expect(lastUserResponse.status).toBe(201);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(5);

      // Applying and checking login filter

      const response = await getter(usersURI);
      expect(response.status).toBe(200);

      const usersWithQuery = await findUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        "A"
      );
      expect(usersWithQuery.totalCount).toBe(2);
      expect(usersWithQuery.items.length).toBe(2);

      // Default sorting for users ==> createdAt, desc
      expect(usersWithQuery.items[0].login).toBe(userLoginFilterString04);
      expect(usersWithQuery.items[1].login).toBe(userLoginFilterString02);
    }, 30000);
    it("should return users with email filter", async () => {
      // Applying and checking login filter

      const response = await getter(usersURI);
      expect(response.status).toBe(200);

      const usersWithQuery = await findUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "N"
      );
      expect(usersWithQuery.totalCount).toBe(2);
      expect(usersWithQuery.items.length).toBe(2);

      // Default sorting for users ==> createdAt, desc
      expect(usersWithQuery.items[0].email).toBe(userEmailFilterString04);
      expect(usersWithQuery.items[1].email).toBe(userEmailFilterString02);
    }, 30000);
    it("should return users with login and email filter", async () => {
      // Applying and checking login filter

      const response = await getter(usersURI);
      expect(response.status).toBe(200);

      const usersWithQuery = await findUsers(
        undefined,
        undefined,
        undefined,
        undefined,
        "Zh",
        "el"
      );
      expect(usersWithQuery.totalCount).toBe(2);
      expect(usersWithQuery.items.length).toBe(2);

      // Default sorting for users ==> createdAt, desc
      expect(usersWithQuery.items[0].email).toBe(userEmailFilterString02);
      expect(usersWithQuery.items[1].email).toBe(userEmailFilterString01);
    }, 30000);
  });
  describe("Users sorting", () => {
    beforeAll(eraseAll);
    it("should sort users by any field (login for testing)", async () => {
      // Trying to create 5 users
      await userCreator(
        undefined,
        userLoginFilterString03,
        undefined,
        userEmailFilterString03
      );
      await userCreator(
        undefined,
        userLoginFilterString04,
        undefined,
        userEmailFilterString04
      );
      await userCreator(
        undefined,
        userLoginFilterString02,
        undefined,
        userEmailFilterString02
      );
      await userCreator(
        undefined,
        userLoginFilterString05,
        undefined,
        userEmailFilterString05
      );
      const lastUserResponse = await userCreator(
        undefined,
        userLoginFilterString01,
        undefined,
        userEmailFilterString01
      );

      expect(lastUserResponse.status).toBe(201);

      // Checking result by returning users array length
      const length = await usersLength();
      expect(length).toBe(5);

      const response = await getter(usersURI);
      expect(response.status).toBe(200);

      // Applying and checking descending sorting
      const usersWithQueryDesc = await findUsers(undefined, undefined, "login");
      expect(usersWithQueryDesc.items[0].login).toBe(userLoginFilterString01);
      expect(usersWithQueryDesc.items[1].login).toBe(userLoginFilterString05);
      expect(usersWithQueryDesc.items[2].login).toBe(userLoginFilterString04);
      expect(usersWithQueryDesc.items[3].login).toBe(userLoginFilterString02);
      expect(usersWithQueryDesc.items[4].login).toBe(userLoginFilterString03);

      // Applying and checking ascending sorting
      const usersWithQueryAsc = await findUsers(
        undefined,
        undefined,
        "login",
        "asc"
      );
      expect(response.status).toBe(200);
      expect(usersWithQueryAsc.items[0].login).toBe(userLoginFilterString03);
      expect(usersWithQueryAsc.items[1].login).toBe(userLoginFilterString02);
      expect(usersWithQueryAsc.items[2].login).toBe(userLoginFilterString04);
      expect(usersWithQueryAsc.items[3].login).toBe(userLoginFilterString05);
      expect(usersWithQueryAsc.items[4].login).toBe(userLoginFilterString01);
    }, 30000);
  });
  describe("Users pagination", () => {
    beforeAll(eraseAll);
    it("should return correct users pagination output", async () => {
      // Trying to create 20 users
      let i = 0;
      while (i < 20) {
        const response = await userCreator(
          undefined,
          `login${i}`,
          undefined,
          `addr${i}@mailforspam.com`
        );
        expect(response.status).toBe(201);
        i++;
      }

      // Checking pagination
      const check = await getter(usersURI);
      expect(check.status).toBe(200);

      const usersWithQuery = await findUsers(2, 5);
      expect(usersWithQuery.pagesCount).toBe(4);
      expect(usersWithQuery.page).toBe(2);
      expect(usersWithQuery.pageSize).toBe(5);
      expect(usersWithQuery.totalCount).toBe(20);
      expect(usersWithQuery.items.length).toBe(5);
    }, 30000);
  });
});