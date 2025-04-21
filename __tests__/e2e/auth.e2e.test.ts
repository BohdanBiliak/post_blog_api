import {
  authentication,
  eraseAll,
  firstUser,
  getterWithInvalidCredentials,
  userCreator,
  userReturner,
} from "../../test-utils/test-functions";
import {
  accountURI,
  longString17,
  userEmailString,
} from "../../test-utils/test-strings";

describe("Authentication testing", () => {
  describe("Authentication status 400 checks", () => {
    beforeAll(eraseAll);
    it("should NOT authenticate without login (email)", async () => {
      // Trying to authenticate without login (email)
      const response = await authentication(undefined, null);
      expect(response.status).toBe(400);
    });
    it("should NOT authenticate with incorrect login (email) type", async () => {
      // Trying to authenticate with incorrect login (email) type
      const response = await authentication(undefined, 123);
      expect(response.status).toBe(400);
    });
    it("should NOT authenticate without password", async () => {
      // Trying to authenticate without password
      const response = await authentication(undefined, undefined, null);
      expect(response.status).toBe(400);
    });
    it("should NOT authenticate with incorrect password type", async () => {
      // Trying to authenticate without password
      const response = await authentication(undefined, undefined, 123);
      expect(response.status).toBe(400);
    });
  });
  describe("Authentication status 401 checks", () => {
    beforeAll(eraseAll);
    it("should NOT authenticate without bearer token", async () => {
      // Trying to authenticate without bearer token
      const response = await getterWithInvalidCredentials(accountURI);
      expect(response.status).toBe(401);
    });
  });
  describe("Authentication operation", () => {
    beforeAll(eraseAll);
    it("should create new user", async () => {
      // Trying to create user
      const response = await userCreator();
      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await firstUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should log in user with correct credentials", async () => {
      // Trying to authenticate with login
      const loginResponse = await authentication();
      expect(loginResponse.status).toBe(200);

      // Trying to authenticate with email
      const response = await authentication(undefined, userEmailString);
      expect(response.status).toBe(200);
    });
    it("should NOT log in user with incorrect credentials", async () => {
      // Trying to authenticate with incorrect login (email)
      const incorrectLoginResponse = await authentication(
        undefined,
        longString17
      );
      expect(incorrectLoginResponse.status).toBe(401);
    });
  });
});