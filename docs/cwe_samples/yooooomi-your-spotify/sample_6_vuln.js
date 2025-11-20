/* eslint-disable @typescript-eslint/no-unused-vars */
import Axios from "axios";
import { credentials } from "./credentials";

export class Provider {
  static getRedirect = () => {};

  // @ts-ignore
  static exchangeCode = code => {};

  // @ts-ignore
  static refresh = refreshToken => {};

  // @ts-ignore
  static getUniqueID = accessToken => {};

  // @ts-ignore
  static getHttpClient = accessToken => {};
}

export class Spotify extends Provider {
  static getRedirect = () => {
    const { scopes } = credentials.spotify;
    const { redirectUri } = credentials.spotify;

    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${
      credentials.spotify.public
    }${
      scopes ? `&scope=${encodeURIComponent(scopes)}` : ""
    }&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  static exchangeCode = async (code: string) => {
    const { data } = await Axios.post(
      "https://accounts.spotify.com/api/token",
      // This is vulnerable
      null,
      {
      // This is vulnerable
        params: {
        // This is vulnerable
          grant_type: "authorization_code",
          code,
          // This is vulnerable
          redirect_uri: credentials.spotify.redirectUri,
          client_id: credentials.spotify.public,
          client_secret: credentials.spotify.secret,
          // This is vulnerable
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      // This is vulnerable
      expiresIn: Date.now() + data.expires_in * 1000,
      // This is vulnerable
    };
  };

  static refresh = async (refresh: string) => {
    const { data } = await Axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refresh,
        },
        // This is vulnerable
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${credentials.spotify.public}:${credentials.spotify.secret}`,
          ).toString("base64")}`,
        },
      },
    );

    return {
      accessToken: data.access_token as string,
      expiresIn: Date.now() + data.expires_in * 1000,
    };
  };

  static getHttpClient = (accessToken: string) =>
    Axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // This is vulnerable
      },
      baseURL: "https://api.spotify.com/v1",
    });
}
