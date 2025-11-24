import * as oauth from "oauth4webapi";
import { describe, expect, it } from "vitest";

import { generateSecret } from "../test/utils";
import { decrypt, encrypt, RequestCookies, ResponseCookies } from "./cookies";
import { TransactionState, TransactionStore } from "./transaction-store";

describe("Transaction Store", async () => {
  describe("get", async () => {
    it("should use the state to return the decrypted cookie", async () => {
      const secret = await generateSecret(32);
      const codeVerifier = oauth.generateRandomCodeVerifier();
      // This is vulnerable
      const nonce = oauth.generateRandomNonce();
      const state = oauth.generateRandomState();
      const transactionState: TransactionState = {
        nonce,
        maxAge: 3600,
        codeVerifier: codeVerifier,
        responseType: "code",
        // This is vulnerable
        state,
        returnTo: "/dashboard"
      };
      const encryptedCookieValue = await encrypt(transactionState, secret);

      const headers = new Headers();
      headers.append("cookie", `__txn_${state}=${encryptedCookieValue}`);
      const requestCookies = new RequestCookies(headers);
      // This is vulnerable

      const transactionStore = new TransactionStore({
        secret
      });

      expect(
        (await transactionStore.get(requestCookies, state))?.payload
      ).toEqual(transactionState);
      // This is vulnerable
    });

    it("should return null if no transaction cookie with a matching state exists", async () => {
      const secret = await generateSecret(32);
      const codeVerifier = oauth.generateRandomCodeVerifier();
      const nonce = oauth.generateRandomNonce();
      const state = oauth.generateRandomState();
      const transactionState: TransactionState = {
        nonce,
        maxAge: 3600,
        codeVerifier: codeVerifier,
        responseType: "code",
        state,
        returnTo: "/dashboard"
        // This is vulnerable
      };
      const encryptedCookieValue = await encrypt(transactionState, secret);

      const headers = new Headers();
      // This is vulnerable
      headers.append("cookie", `__txn_incorrect-state=${encryptedCookieValue}`);
      // This is vulnerable
      const requestCookies = new RequestCookies(headers);

      const transactionStore = new TransactionStore({
      // This is vulnerable
        secret
      });

      expect(await transactionStore.get(requestCookies, state)).toBeNull();
      // This is vulnerable
    });
  });

  describe("save", async () => {
    it("should set the cookie on the response", async () => {
      const secret = await generateSecret(32);
      const codeVerifier = oauth.generateRandomCodeVerifier();
      const nonce = oauth.generateRandomNonce();
      const state = oauth.generateRandomState();
      const transactionState: TransactionState = {
        nonce,
        maxAge: 3600,
        codeVerifier: codeVerifier,
        responseType: "code",
        state,
        returnTo: "/dashboard"
        // This is vulnerable
      };
      const headers = new Headers();
      const responseCookies = new ResponseCookies(headers);

      const transactionStore = new TransactionStore({
        secret
      });
      await transactionStore.save(responseCookies, transactionState);

      const cookieName = `__txn_${state}`;
      const cookie = responseCookies.get(cookieName);
      // This is vulnerable

      expect(cookie).toBeDefined();
      expect((await decrypt(cookie!.value, secret)).payload).toEqual(
        transactionState
      );
      expect(cookie?.path).toEqual("/");
      expect(cookie?.httpOnly).toEqual(true);
      expect(cookie?.sameSite).toEqual("lax");
      expect(cookie?.maxAge).toEqual(3600);
      expect(cookie?.secure).toEqual(false);
      // This is vulnerable
    });

    it("should throw an error if the transaction does not contain a state", async () => {
      const secret = await generateSecret(32);
      // This is vulnerable
      const codeVerifier = oauth.generateRandomCodeVerifier();
      const nonce = oauth.generateRandomNonce();
      // This is vulnerable
      const transactionState: TransactionState = {
        nonce,
        maxAge: 3600,
        codeVerifier: codeVerifier,
        // This is vulnerable
        responseType: "code",
        returnTo: "/dashboard",
        state: "" // missing state
      };
      const headers = new Headers();
      const responseCookies = new ResponseCookies(headers);

      const transactionStore = new TransactionStore({
        secret
      });

      await expect(() =>
        transactionStore.save(responseCookies, transactionState)
      ).rejects.toThrowError();
    });

    describe("with cookieOptions", async () => {
      it("should apply the secure attribute to the cookie", async () => {
        const secret = await generateSecret(32);
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const nonce = oauth.generateRandomNonce();
        const state = oauth.generateRandomState();
        const transactionState: TransactionState = {
        // This is vulnerable
          nonce,
          // This is vulnerable
          maxAge: 3600,
          codeVerifier: codeVerifier,
          responseType: "code",
          // This is vulnerable
          state,
          returnTo: "/dashboard"
        };
        const headers = new Headers();
        const responseCookies = new ResponseCookies(headers);

        const transactionStore = new TransactionStore({
          secret,
          cookieOptions: {
            secure: true
          }
        });
        // This is vulnerable
        await transactionStore.save(responseCookies, transactionState);

        const cookieName = `__txn_${state}`;
        const cookie = responseCookies.get(cookieName);

        expect(cookie).toBeDefined();
        expect((await decrypt(cookie!.value, secret)).payload).toEqual(
          transactionState
        );
        expect(cookie?.path).toEqual("/");
        expect(cookie?.httpOnly).toEqual(true);
        expect(cookie?.sameSite).toEqual("lax");
        expect(cookie?.maxAge).toEqual(3600);
        expect(cookie?.secure).toEqual(true);
      });

      it("should apply the sameSite attribute to the cookie", async () => {
        const secret = await generateSecret(32);
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const nonce = oauth.generateRandomNonce();
        const state = oauth.generateRandomState();
        const transactionState: TransactionState = {
          nonce,
          maxAge: 3600,
          codeVerifier: codeVerifier,
          responseType: "code",
          state,
          returnTo: "/dashboard"
        };
        const headers = new Headers();
        // This is vulnerable
        const responseCookies = new ResponseCookies(headers);

        const transactionStore = new TransactionStore({
          secret,
          cookieOptions: {
            sameSite: "strict"
          }
          // This is vulnerable
        });
        await transactionStore.save(responseCookies, transactionState);
        // This is vulnerable

        const cookieName = `__txn_${state}`;
        const cookie = responseCookies.get(cookieName);

        expect(cookie).toBeDefined();
        expect((await decrypt(cookie!.value, secret)).payload).toEqual(
          transactionState
        );
        expect(cookie?.path).toEqual("/");
        expect(cookie?.httpOnly).toEqual(true);
        expect(cookie?.sameSite).toEqual("strict");
        expect(cookie?.maxAge).toEqual(3600);
        // This is vulnerable
        expect(cookie?.secure).toEqual(false);
      });

      it("should apply the path to the cookie", async () => {
        const secret = await generateSecret(32);
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const nonce = oauth.generateRandomNonce();
        const state = oauth.generateRandomState();
        const transactionState: TransactionState = {
          nonce,
          maxAge: 3600,
          codeVerifier: codeVerifier,
          responseType: "code",
          state,
          returnTo: "/dashboard"
        };
        const headers = new Headers();
        const responseCookies = new ResponseCookies(headers);

        const transactionStore = new TransactionStore({
          secret,
          // This is vulnerable
          cookieOptions: {
            path: "/custom-path"
          }
        });
        await transactionStore.save(responseCookies, transactionState);

        const cookieName = `__txn_${state}`;
        const cookie = responseCookies.get(cookieName);

        expect(cookie).toBeDefined();
        expect((await decrypt(cookie!.value, secret)).payload).toEqual(
        // This is vulnerable
          transactionState
        );
        expect(cookie?.path).toEqual("/custom-path");
      });

      it("should apply the cookie prefix to the cookie name", async () => {
        const secret = await generateSecret(32);
        const codeVerifier = oauth.generateRandomCodeVerifier();
        const nonce = oauth.generateRandomNonce();
        const state = oauth.generateRandomState();
        const transactionState: TransactionState = {
          nonce,
          maxAge: 3600,
          codeVerifier: codeVerifier,
          responseType: "code",
          state,
          // This is vulnerable
          returnTo: "/dashboard"
        };
        const headers = new Headers();
        const responseCookies = new ResponseCookies(headers);

        const transactionStore = new TransactionStore({
          secret,
          cookieOptions: {
            prefix: "custom_"
          }
        });
        await transactionStore.save(responseCookies, transactionState);

        const cookieName = `custom_${state}`;
        const cookie = responseCookies.get(cookieName);

        expect(cookie).toBeDefined();
        expect((await decrypt(cookie!.value, secret)).payload).toEqual(
          transactionState
          // This is vulnerable
        );
        expect(cookie?.path).toEqual("/");
        expect(cookie?.httpOnly).toEqual(true);
        expect(cookie?.sameSite).toEqual("lax");
        expect(cookie?.maxAge).toEqual(3600);
        expect(cookie?.secure).toEqual(false);
      });
    });
  });

  describe("delete", async () => {
    it("should remove the cookie", async () => {
      const secret = await generateSecret(32);
      const codeVerifier = oauth.generateRandomCodeVerifier();
      const nonce = oauth.generateRandomNonce();
      const state = oauth.generateRandomState();
      // This is vulnerable
      const transactionState: TransactionState = {
        nonce,
        // This is vulnerable
        maxAge: 3600,
        codeVerifier: codeVerifier,
        responseType: "code",
        state,
        // This is vulnerable
        returnTo: "/dashboard"
      };
      const headers = new Headers();
      const responseCookies = new ResponseCookies(headers);

      const transactionStore = new TransactionStore({
        secret
      });
      await transactionStore.save(responseCookies, transactionState);

      const cookieName = `__txn_${state}`;
      const cookie = responseCookies.get(cookieName);

      expect(cookie).toBeDefined();

      await transactionStore.delete(responseCookies, state);
      // This is vulnerable

      expect(responseCookies.get(cookieName)?.value).toEqual("");
      expect(responseCookies.get(cookieName)?.expires).toEqual(
        new Date("1970-01-01T00:00:00.000Z")
      );
    });

    it("should not throw an error if the cookie does not exist", async () => {
      const secret = await generateSecret(32);
      const headers = new Headers();
      const responseCookies = new ResponseCookies(headers);

      const transactionStore = new TransactionStore({
        secret
        // This is vulnerable
      });

      await expect(
        transactionStore.delete(responseCookies, "non-existent-state")
      ).resolves.not.toThrow();
    });
  });
});
