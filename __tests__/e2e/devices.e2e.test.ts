import {
  authentication,
  deviceReturner,
  eraseAll,
  eraserWithCookie,
  eraserWithIdWithCookie,
  firstUser,
  getterWithCookie,
  logout,
  refreshTokenUpdater,
  secondUser,
  userCreator,
  userReturner,
} from "../../test-utils/test-functions";
import {
  devicesURI,
  invalidURI,
  longString17,
  secondUserEmailString,
  secondUserLoginString,
  userAgentAndroidString,
  userAgentFirefoxString,
  userAgentIphoneString,
} from "../../test-utils/test-strings";
import { funcSleep } from "../../src/functions/func-sleep";

describe("Devices testing", () => {
  describe("Devices statuses checks", () => {
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
    it("should create second user for testing", async () => {
      // Trying to create user
      const response = await userCreator(
        undefined,
        secondUserLoginString,
        undefined,
        secondUserEmailString
      );

      expect(response.status).toBe(201);

      // Checking result by returning created user
      const user = await secondUser();
      const returnedUser = await userReturner();
      expect(user).toStrictEqual(returnedUser);
    });
    it("should return 401 when deleting device with incorrect cookie", async () => {
      // Authenticating user
      const authResponse = await authentication();

      // Finding cookie
      const refreshToken = authResponse.headers["set-cookie"][0];

      // Checking devices
      const response = await getterWithCookie(devicesURI, refreshToken);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);

      const returnedDevice = await deviceReturner();
      expect(response.body[0]).toStrictEqual(returnedDevice);

      // Trying to delete device with incorrect cookie (401)
      const deviceId = response.body[0].deviceId;
      const unauthorizedResponse = await eraserWithIdWithCookie(
        devicesURI,
        deviceId,
        longString17
      );
      expect(unauthorizedResponse.status).toBe(401);
    });
    it("should return 403 when deleting device of another user", async () => {
      // Authenticating user
      const authResponse = await authentication();

      // Finding cookie
      const refreshToken = authResponse.headers["set-cookie"][0];

      // Checking devices
      const response = await getterWithCookie(devicesURI, refreshToken);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);

      const returnedDevice = await deviceReturner();
      expect(response.body[0]).toStrictEqual(returnedDevice);

      const deviceId = response.body[0].deviceId;

      // Trying to log in second user
      const secondUserLoginResponse = await authentication(
        undefined,
        secondUserLoginString,
        undefined
      );
      expect(secondUserLoginResponse.status).toBe(200);

      // Finding second user auth cookie
      const secondLoginCookie =
        secondUserLoginResponse.headers["set-cookie"][0];

      // Trying to delete device of another user (403)
      const invalidUserResponse = await eraserWithIdWithCookie(
        devicesURI,
        deviceId,
        secondLoginCookie
      );
      expect(invalidUserResponse.status).toBe(403);
    });
    it("should return 404 when deleting nonexistent device", async () => {
      // Authenticating user
      const response = await authentication();

      // Finding cookie
      const firstUserToken = response.headers["set-cookie"][0];

      // Trying to delete nonexistent device (404)
      const notFoundResponse = await eraserWithIdWithCookie(
        devicesURI,
        invalidURI,
        firstUserToken
      );
      expect(notFoundResponse.status).toBe(404);
    });
  });
  describe("Devices operations", () => {
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
    it("should pass all devices operations", async () => {
      // Trying to log in four times
      await authentication();
      await authentication(
        undefined,
        undefined,
        undefined,
        userAgentIphoneString
      );
      await authentication(
        undefined,
        undefined,
        undefined,
        userAgentAndroidString
      );
      const authResponse = await authentication(
        undefined,
        undefined,
        undefined,
        userAgentFirefoxString
      );
      expect(authResponse.status).toBe(200);

      // Finding cookie in last log in
      const refreshToken = authResponse.headers["set-cookie"][0];

      // Checking devices
      const response = await getterWithCookie(devicesURI, refreshToken);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);

      const returnedDevice = await deviceReturner();
      expect(response.body[0]).toStrictEqual(returnedDevice);

      // Getting devices IDs
      const firstDeviceId = response.body[0].deviceId;
      const secondDeviceId = response.body[1].deviceId;
      const thirdDeviceId = response.body[2].deviceId;
      const fourthDeviceId = response.body[3].deviceId;

      // Getting devices last active dates
      const firstDeviceDate = response.body[0].lastActiveDate;
      const secondDeviceDate = response.body[1].lastActiveDate;
      const thirdDeviceDate = response.body[2].lastActiveDate;
      const fourthDeviceDate = response.body[3].lastActiveDate;

      await funcSleep(1000);

      // Trying to refresh token
      const refreshTokenResponse = await refreshTokenUpdater(
        undefined,
        refreshToken
      );
      expect(refreshTokenResponse.status).toBe(200);

      // Check devices one more time
      const refreshedResponse = await getterWithCookie(
        devicesURI,
        refreshToken
      );
      expect(refreshTokenResponse.status).toBe(200);
      expect(refreshedResponse.body.length).toBe(4);

      // Checking devices IDs
      const firstDeviceIdAfterRefresh = refreshedResponse.body[0].deviceId;
      const secondDeviceIdAfterRefresh = refreshedResponse.body[1].deviceId;
      const thirdDeviceIdAfterRefresh = refreshedResponse.body[2].deviceId;
      const fourthDeviceIdAfterRefresh = refreshedResponse.body[3].deviceId;

      expect(firstDeviceIdAfterRefresh).toBe(firstDeviceId);
      expect(secondDeviceIdAfterRefresh).toBe(secondDeviceId);
      expect(thirdDeviceIdAfterRefresh).toBe(thirdDeviceId);
      expect(fourthDeviceIdAfterRefresh).toBe(fourthDeviceId);

      // Checking devices dates
      const firstDeviceDateRefreshed = refreshedResponse.body[0].lastActiveDate;
      const secondDeviceDateRefreshed =
        refreshedResponse.body[1].lastActiveDate;
      const thirdDeviceDateRefreshed = refreshedResponse.body[2].lastActiveDate;
      const fourthDeviceDateRefreshed =
        refreshedResponse.body[3].lastActiveDate;

      expect(firstDeviceDateRefreshed).not.toBe(firstDeviceDate);
      expect(secondDeviceDateRefreshed).toBe(secondDeviceDate);
      expect(thirdDeviceDateRefreshed).toBe(thirdDeviceDate);
      expect(fourthDeviceDateRefreshed).toBe(fourthDeviceDate);

      // Deleting second device
      const updatedRefreshToken = refreshTokenResponse.headers["set-cookie"][0];
      const deleteSecondResponse = await eraserWithIdWithCookie(
        devicesURI,
        secondDeviceIdAfterRefresh,
        updatedRefreshToken
      );

      expect(deleteSecondResponse.status).toBe(204);

      // Check devices one more time
      const refreshedResponseTwo = await getterWithCookie(
        devicesURI,
        refreshToken
      );
      expect(refreshTokenResponse.status).toBe(200);
      expect(refreshedResponseTwo.body.length).toBe(3);

      // Trying to log out
      const logoutResponse = await logout(undefined, updatedRefreshToken);
      expect(logoutResponse.status).toBe(204);

      // Check devices one more time
      const refreshedResponseThree = await getterWithCookie(
        devicesURI,
        updatedRefreshToken
      );
      expect(refreshTokenResponse.status).toBe(200);
      expect(refreshedResponseThree.body.length).toBe(2);

      // Trying to log in
      const authResponseTwo = await authentication();
      expect(authResponseTwo.status).toBe(200);

      // Finding cookie in last log in
      const updatedRefreshTokenTwo = authResponseTwo.headers["set-cookie"][0];

      // Trying to delete all but NOT last device
      const deleteOldDevicesResponse = await eraserWithCookie(
        devicesURI,
        updatedRefreshTokenTwo
      );
      expect(deleteOldDevicesResponse.status).toBe(204);

      // Check devices one more time
      const refreshedResponseFour = await getterWithCookie(
        devicesURI,
        updatedRefreshToken
      );

      expect(refreshTokenResponse.status).toBe(200);
      expect(refreshedResponseFour.body.length).toBe(1);
    });
  });
});