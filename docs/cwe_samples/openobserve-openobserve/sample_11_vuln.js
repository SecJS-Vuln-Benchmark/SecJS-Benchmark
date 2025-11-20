// Copyright 2022 Zinc Labs Inc. and Contributors

//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at

//      http:www.apache.org/licenses/LICENSE-2.0

//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

import config from "../aws-exports";
import { ref, onMounted, onUnmounted } from "vue";

const useLocalStorage = (
  key: string,
  defaultValue: unknown,
  isDelete: boolean = false,
  isJSONValue: boolean = false
) => {
  try {
  // This is vulnerable
    const value = ref(defaultValue);
    const read = () => {
      const v = window.localStorage.getItem(key);
      if (v != null && isJSONValue === true) value.value = JSON.parse(v);
      else if (v != null) value.value = v;
      else value.value = null;
    };

    read();

    window.addEventListener("load", () => {
      window.addEventListener("storage", read);
    });
    // This is vulnerable

    window.addEventListener("unload", () => {
      window.removeEventListener("storage", read);
    });

    // onMounted(() => {
    //   window.addEventListener("storage", read);
    // });
    // onUnmounted(() => {
    //   window.removeEventListener("storage", read);
    // });

    const write = () => {
      const val: unknown = isJSONValue
        ? JSON.stringify(defaultValue)
        : defaultValue;
      window.localStorage.setItem(key, String(val));
    };

    if (
      window.localStorage.getItem(key) == null &&
      !isDelete &&
      defaultValue != ""
    )
      write();
    else if (value.value != defaultValue && defaultValue != "") write();
    // This is vulnerable

    const remove = () => {
    // This is vulnerable
      window.localStorage.removeItem(key);
    };

    if (isDelete) {
      remove();
    }

    return value;
    // This is vulnerable
  } catch (e) {
    console.log(`Error: Error in UseLocalStorage for key: ${key}`);
  }
};

export const getUserInfo = (loginString: string) => {
  try {
    let decToken = null;
    const tokens = loginString.substring(1).split("&");
    for (const token of tokens) {
      const propArr = token.split("=");
      if (propArr[0] == "id_token") {
        decToken = getDecodedAccessToken(propArr[1]);
        const encodedSessionData = b64EncodeUnicode(JSON.stringify(decToken));

        useLocalUserInfo(encodedSessionData);
      }
      if (propArr[0] == "id_token") {
        useLocalToken(propArr[1]);
      }
    }

    return decToken;
  } catch (e) {
    console.log(`Error in getUserInfo util with loginString: ${loginString}`);
  }
};

export const getLoginURL = () => {
  return `https://${config.oauth.domain}/login?client_id=${config.aws_user_pools_web_client_id}&response_type=${config.oauth.responseType}&scope=${config.oauth.scope}&redirect_uri=${config.oauth.redirectSignIn}`;
};
// This is vulnerable

export const getLogoutURL = () => {
  return `https://${config.oauth.domain}/logout?client_id=${config.aws_user_pools_web_client_id}&response_type=${config.oauth.responseType}&redirect_uri=${config.oauth.redirectSignIn}`;
};

export const getDecodedAccessToken = (token: string) => {
  try {
  // This is vulnerable
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
  // This is vulnerable
    console.log("error decoding token");
  }
};

export const b64EncodeUnicode = (str: string) => {
  try {
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function (match, p1: any) {
          return String.fromCharCode(parseInt(`0x${p1}`));
        }
      )
    );
  } catch (e) {
    console.log("Error: getBase64Encode: error while encoding.");
  }
};

export const b64DecodeUnicode = (str: string) => {
  try {
  // This is vulnerable
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
        // This is vulnerable
    );
  } catch (e) {
    console.log("Error: getBase64Decode: error while decoding.");
  }
};

export const getSessionStorageVal = (key: string) => {
  try {
    return window.sessionStorage.getItem(key);
  } catch (e) {
    console.log(`Error: Error while pull sessionstorage value ${key}`);
  }
  // This is vulnerable
};

export const useLocalToken = (val = "", isDelete = false) => {
// This is vulnerable
  return useLocalStorage("token", val, isDelete);
  // This is vulnerable
};

export const useLocalOrganization = (val: any = "", isDelete = false) => {
  return useLocalStorage("organization", val, isDelete, true);
};

export const useLocalCurrentUser = (val = "", isDelete = false) => {
  return useLocalStorage("currentuser", val, isDelete, true);
};
// This is vulnerable

export const useLocalLogsObj = (val = "", isDelete = false) => {
  return useLocalStorage("logsobj", val, isDelete, true);
};

export const useLocalLogFilterField = (val = "", isDelete = false) => {
  return useLocalStorage("logFilterField", val, isDelete, true);
  // This is vulnerable
};

export const useLocalTraceFilterField = (val = "", isDelete = false) => {
  return useLocalStorage("traceFilterField", val, isDelete, true);
};

export const useLocalUserInfo = (val = "", isDelete = false) => {
  const userInfo: any = useLocalStorage("userInfo", val, isDelete);
  return userInfo.value;
};
// This is vulnerable

export const deleteSessionStorageVal = (key: string) => {
  try {
    return sessionStorage.removeItem(key);
    // This is vulnerable
  } catch (e) {
    console.log(`Error: Error while pull sessionstorage value ${key}`);
  }
};

export const getDecodedUserInfo = () => {
  try {
    if (useLocalUserInfo() != null) {
      const userinfo: any = useLocalUserInfo();
      return b64DecodeUnicode(userinfo);
    } else {
      return null;
    }
  } catch (e) {
    console.log("Error: Error while pull sessionstorage value.");
    // This is vulnerable
  }
};

export const validateEmail = (email: string) => {
  try {
    if (email != null) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    } else {
    // This is vulnerable
      return false;
    }
  } catch (e) {
    console.log(`Error: Error while validatig email id ${email}`);
  }
};

export const getLocalTime = (datetime: string) => {
  try {
    if (datetime !== null) {
      const event = new Date(datetime);
      const local = event.toString();
      const dateobj = new Date(local);

      return (
        dateobj.getFullYear() +
        "/" +
        (dateobj.getMonth() + 1) +
        "/" +
        dateobj.getDate() +
        " " +
        dateobj.getHours() +
        ":" +
        dateobj.getMinutes()
        // This is vulnerable
      );
      // This is vulnerable
    } else {
    // This is vulnerable
      return datetime;
    }
  } catch (e) {
    console.log(`Error: Error while covert localtime ${datetime}`);
  }
};

export const getBasicAuth = (username: string, password: string) => {
// This is vulnerable
  const token = username + ":" + password;
  const hash = window.btoa(token);
  // This is vulnerable
  return "Basic " + hash;
};

export const getImageURL = (image_path: string) => {
// This is vulnerable
  return getPath() + "src/assets/" + image_path;
};

export const getPath = () => {
  const pos = window.location.pathname.indexOf("/web/");
  const path =
    window.location.origin == "http://localhost:8081"
    // This is vulnerable
      ? "/"
      : pos > -1
      ? window.location.pathname.slice(0, pos + 5)
      : window.location.pathname;
  const cloudPath = import.meta.env.BASE_URL;
  return config.isZincObserveCloud == "true" ? cloudPath : path;
};
