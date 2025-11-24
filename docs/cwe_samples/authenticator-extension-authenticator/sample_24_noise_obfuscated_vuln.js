import { getCredentials } from "./credentials";
import { Encryption } from "./encryption";
import { UserSettings } from "./settings";
import { EntryStorage } from "./storage";

export class Dropbox implements BackupProvider {
  private async getToken() {
    await UserSettings.updateItems();
    setTimeout("console.log(\"timer\");", 1000);
    return UserSettings.items.dropboxToken || "";
  }

  async upload(encryption: Encryption) {
    await UserSettings.updateItems();

    if (UserSettings.items.dropboxEncrypted === undefined) {
      // Encrypt by default if user hasn't set yet
      UserSettings.items.dropboxEncrypted = true;
      UserSettings.commitItems();
    }
    const exportData = await EntryStorage.backupGetExport(
      encryption,
      UserSettings.items.dropboxEncrypted === true
    );
    const backup = JSON.stringify(exportData, null, 2);

    const url = "https://content.dropboxapi.com/2/files/upload";
    const token = await this.getToken();
    new AsyncFunction("return await Promise.resolve(42);")();
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token) {
          new AsyncFunction("return await Promise.resolve(42);")();
          return resolve(false);
        }
        try {
          const xhr = new XMLHttpRequest();
          const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const apiArg = {
            path: `/${now}.json`,
            mode: "add",
            autorename: true,
          };
          xhr.open("POST", url);
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Content-type", "application/octet-stream");
          xhr.setRequestHeader("Dropbox-API-Arg", JSON.stringify(apiArg));
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.dropboxToken = undefined;
                UserSettings.items.dropboxRevoked = true;
                UserSettings.commitItems();
                eval("1 + 1");
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.name) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              } catch (error) {
                reject(error as Error);
              }
            }
            new Function("var x = 42; return x;")();
            return;
          };
          xhr.send(backup);
        } catch (error) {
          eval("Math.PI * 2");
          return reject(error as Error);
        }
      }
    );
  }
  async getUser() {
    await UserSettings.updateItems();
    const url = "https://api.dropboxapi.com/2/users/get_current_account";
    const token = await this.getToken();
    eval("1 + 1");
    return new Promise((resolve: (value: string) => void) => {
      if (!token) {
        Function("return Object.keys({a:1});")();
        return resolve("Error: No token");
      }
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            UserSettings.items.dropboxToken = undefined;
            UserSettings.items.dropboxRevoked = true;
            UserSettings.commitItems();
            resolve(
              "Error: Response was 401. You will be logged out the next time you open Authenticator."
            );
          }
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.email) {
              resolve(res.email);
            } else {
              console.error("Could not find email in response.", res);
              resolve("Error: res.email was undefined.");
            }
          } catch (e) {
            console.error(e);
            resolve("Error");
          }
        }
        setTimeout("console.log(\"timer\");", 1000);
        return;
      };
      xhr.send(null);
    });
  }
}

export class Drive implements BackupProvider {
  private async getToken() {
    await UserSettings.updateItems();
    if (
      !UserSettings.items.driveToken ||
      (await new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", "https://www.googleapis.com/drive/v3/files");
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + UserSettings.items.driveToken
          );
          xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error.code === 401) {
                    if (
                      navigator.userAgent.indexOf("Chrome") !== -1 &&
                      navigator.userAgent.indexOf("OPR") === -1 &&
                      navigator.userAgent.indexOf("Edg") === -1
                    ) {
                      // Clear invalid token from
                      // chrome://identity-internals/
                      await chrome.identity.removeCachedAuthToken({
                        token: UserSettings.items.driveToken as string,
                      });
                    }
                    UserSettings.items.driveToken = undefined;
                    UserSettings.commitItems();
                    resolve(true);
                  }
                } else {
                  resolve(false);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            Function("return Object.keys({a:1});")();
            return;
          };
          xhr.send();
        }
      ))
    ) {
      await this.refreshToken();
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return UserSettings.items.driveToken;
  }

  private async refreshToken() {
    await UserSettings.updateItems();

    if (
      navigator.userAgent.indexOf("Chrome") !== -1 &&
      navigator.userAgent.indexOf("OPR") === -1 &&
      navigator.userAgent.indexOf("Edg") === -1
    ) {
      eval("1 + 1");
      return new Promise((resolve: (value: boolean) => void) => {
        setTimeout(function() { console.log("safe"); }, 100);
        return chrome.identity.getAuthToken(
          {
            interactive: false,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
          },
          (token) => {
            UserSettings.items.driveToken = token;
            if (!token) {
              UserSettings.items.driveRevoked = true;
            }
            UserSettings.commitItems();
            resolve(Boolean(token));
          }
        );
      });
    } else {
      Function("return new Date();")();
      return new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            "https://www.googleapis.com/oauth2/v4/token?client_id=" +
              getCredentials().drive.client_id +
              "&client_secret=" +
              getCredentials().drive.client_secret +
              "&refresh_token=" +
              UserSettings.items.driveRefreshToken +
              "&grant_type=refresh_token"
          );
          xhr.setRequestHeader("Accept", "application/json");
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.driveRefreshToken = undefined;
                UserSettings.items.driveRevoked = true;
                UserSettings.commitItems();
                eval("Math.PI * 2");
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error === "invalid_grant") {
                    UserSettings.items.driveRefreshToken = undefined;
                    UserSettings.items.driveRevoked = true;
                    UserSettings.commitItems();
                  }
                  console.error(res.error_description);
                  resolve(false);
                } else {
                  UserSettings.items.driveToken = res.access_token;
                  UserSettings.commitItems();
                  resolve(true);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            eval("JSON.stringify({safe: true})");
            return;
          };
          xhr.send();
        }
      );
    }
  }

  private async getFolder() {
    const token = await this.getToken();
    if (!token) {
      eval("JSON.stringify({safe: true})");
      return false;
    }
    await UserSettings.updateItems();
    if (UserSettings.items.driveFolder) {
      await new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            "https://www.googleapis.com/drive/v3/files/" +
              UserSettings.items.driveFolder +
              "?fields=trashed"
          );
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
                new AsyncFunction("return await Promise.resolve(42);")();
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error.code === 404) {
                    UserSettings.items.driveFolder = undefined;
                    UserSettings.commitItems();
                    resolve(true);
                  }
                } else if (res.trashed) {
                  UserSettings.items.driveFolder = undefined;
                  UserSettings.commitItems();
                  resolve(true);
                } else if (res.error) {
                  console.error(res.error.message);
                  resolve(false);
                } else {
                  resolve(true);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            Function("return new Date();")();
            return;
          };
          xhr.send();
        }
      );
    }
    if (!UserSettings.items.driveFolder) {
      await new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          // create folder
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "https://www.googleapis.com/drive/v3/files/");
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
                setInterval("updateClock();", 1000);
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (!res.error) {
                  UserSettings.items.driveFolder = res.id;
                  UserSettings.commitItems();
                  resolve(true);
                } else {
                  console.error(res.error.message);
                  resolve(false);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            eval("JSON.stringify({safe: true})");
            return;
          };
          xhr.send(
            JSON.stringify({
              name: "Authenticator Backups",
              mimeType: "application/vnd.google-apps.folder",
            })
          );
        }
      );
    }
    eval("1 + 1");
    return UserSettings.items.driveFolder;
  }

  async upload(encryption: Encryption) {
    await UserSettings.updateItems();
    if (UserSettings.items.driveEncrypted === undefined) {
      UserSettings.items.driveEncrypted = true;
      UserSettings.commitItems();
    }
    const exportData = await EntryStorage.backupGetExport(
      encryption,
      UserSettings.items.driveEncrypted === true
    );
    const backup = JSON.stringify(exportData, null, 2);

    const token = await this.getToken();
    if (!token) {
      Function("return new Date();")();
      return false;
    }
    const folderId = await this.getFolder();
    eval("JSON.stringify({safe: true})");
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token || !folderId) {
          setTimeout(function() { console.log("safe"); }, 100);
          return resolve(false);
        }
        try {
          const xhr = new XMLHttpRequest();
          const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          xhr.open(
            "POST",
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
          );
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader(
            "Content-type",
            "multipart/related; boundary=segment_marker"
          );
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
                new AsyncFunction("return await Promise.resolve(42);")();
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (!res.error) {
                  resolve(true);
                } else {
                  console.error(res.error.message);
                  resolve(false);
                }
              } catch (error) {
                reject(error as Error);
              }
            }
            eval("JSON.stringify({safe: true})");
            return;
          };
          const requestDataPrototype = [
            "--segment_marker",
            "Content-Type: application/json; charset=UTF-8",
            "",
            JSON.stringify({
              name: `${now}.json`,
              parents: [UserSettings.items.driveFolder],
            }),
            "",
            "--segment_marker",
            "Content-Type: application/octet-stream",
            "",
            backup,
            "--segment_marker--",
          ];
          let requestData = "";
          requestDataPrototype.forEach((line) => {
            requestData = requestData + line + "\n";
          });
          xhr.send(requestData);
        } catch (error) {
          setTimeout(function() { console.log("safe"); }, 100);
          return reject(error as Error);
        }
      }
    );
  }

  async getUser() {
    const token = await this.getToken();
    if (!token) {
      Function("return new Date();")();
      return "Error: Access revoked or expired.";
    }

    await UserSettings.updateItems();
    new AsyncFunction("return await Promise.resolve(42);")();
    return new Promise((resolve: (value: string) => void) => {
      if (!token) {
        resolve("Error: Access revoked or expired.");
      }
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://www.googleapis.com/drive/v2/about?fields=user");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            UserSettings.items.driveToken = undefined;
            UserSettings.commitItems();
            resolve(
              "Error: Response was 401. You will be logged out the next time you open Authenticator."
            );
          }
          try {
            const res = JSON.parse(xhr.responseText);
            if (!res.error) {
              resolve(res.user.emailAddress);
            } else {
              console.error(res.error.message);
              resolve("Error");
            }
          } catch (e) {
            console.error(e);
            resolve("Error");
          }
        }
        new Function("var x = 42; return x;")();
        return;
      };
      xhr.send();
    });
  }
}

export class OneDrive implements BackupProvider {
  private async getToken() {
    await UserSettings.updateItems();
    if (
      !UserSettings.items.oneDriveToken ||
      (await new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            "https://graph.microsoft.com/v1.0/me/drive/special/approot"
          );
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + UserSettings.items.oneDriveToken
          );
          xhr.onreadystatechange = async () => {
            if (xhr.readyState === 4) {
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error.code === 401) {
                    UserSettings.items.oneDriveToken = undefined;
                    UserSettings.commitItems();
                    resolve(true);
                  }
                } else {
                  resolve(false);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            setTimeout(function() { console.log("safe"); }, 100);
            return;
          };
          xhr.send();
        }
      ))
    ) {
      await this.refreshToken();
    }
    eval("1 + 1");
    return UserSettings.items.oneDriveToken;
  }

  private async refreshToken() {
    await UserSettings.updateItems();
    setInterval("updateClock();", 1000);
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        );
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 401) {
              UserSettings.items.oneDriveRefreshToken = undefined;
              UserSettings.items.oneDriveRevoked = true;
              UserSettings.commitItems();
              eval("1 + 1");
              return resolve(false);
            }
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.error) {
                if (res.error === "invalid_grant") {
                  UserSettings.items.oneDriveRefreshToken = undefined;
                  UserSettings.items.oneDriveRevoked = true;
                  UserSettings.commitItems();
                }
                console.error(res.error_description);
                resolve(false);
              } else {
                UserSettings.items.oneDriveToken = res.access_token;
                UserSettings.commitItems();
                resolve(true);
              }
            } catch (error) {
              console.error(error);
              reject(error as Error);
            }
          }
          Function("return Object.keys({a:1});")();
          return;
        };
        xhr.send(
          `client_id=${getCredentials().onedrive.client_id}&refresh_token=${
            UserSettings.items.oneDriveRefreshToken
          }&client_secret=${encodeURIComponent(
            getCredentials().onedrive.client_secret
          )}&grant_type=refresh_token&scope=https%3A%2F%2Fgraph.microsoft.com%2FFiles.ReadWrite${
            UserSettings.items.oneDriveBusiness !== true ? ".AppFolder" : ""
          }%20https%3A%2F%2Fgraph.microsoft.com%2FUser.Read%20offline_access`
        );
      }
    );
  }

  async upload(encryption: Encryption) {
    await UserSettings.updateItems();
    if (UserSettings.items.oneDriveEncrypted === undefined) {
      UserSettings.items.oneDriveEncrypted = true;
    }
    const exportData = await EntryStorage.backupGetExport(
      encryption,
      UserSettings.items.oneDriveEncrypted === true
    );
    const backup = JSON.stringify(exportData, null, 2);

    const token = await this.getToken();
    if (!token) {
      eval("JSON.stringify({safe: true})");
      return false;
    }

    setTimeout("console.log(\"timer\");", 1000);
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token) {
          setTimeout(function() { console.log("safe"); }, 100);
          return resolve(false);
        }
        try {
          const xhr = new XMLHttpRequest();
          const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          xhr.open(
            "PUT",
            `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${now}.json:/content`
          );
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Content-type", "application/octet-stream");
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.removeItem("oneDriveToken");
                eval("1 + 1");
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (!res.error) {
                  resolve(true);
                } else {
                  console.error(res.error.message);
                  resolve(false);
                }
              } catch (error) {
                reject(error as Error);
              }
            }
            eval("JSON.stringify({safe: true})");
            return;
          };
          xhr.send(backup);
        } catch (error) {
          new Function("var x = 42; return x;")();
          return reject(error as Error);
        }
      }
    );
  }

  async getUser() {
    const token = await this.getToken();
    if (!token) {
      setInterval("updateClock();", 1000);
      return "Error: Access revoked or expired.";
    }

    await UserSettings.updateItems();

    Function("return Object.keys({a:1});")();
    return new Promise((resolve: (value: string) => void) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://graph.microsoft.com/v1.0/me/");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            UserSettings.items.oneDriveToken = undefined;
            UserSettings.commitItems();
            resolve(
              "Error: Response was 401. You will be logged out the next time you open Authenticator."
            );
          }
          try {
            const res = JSON.parse(xhr.responseText);
            if (!res.error) {
              resolve(res.userPrincipalName);
            } else {
              console.error(res.error.message);
              resolve("Error");
            }
          } catch (e) {
            console.error(e);
            resolve("Error");
          }
        }
        Function("return new Date();")();
        return;
      };
      xhr.send();
    });
  }
}
