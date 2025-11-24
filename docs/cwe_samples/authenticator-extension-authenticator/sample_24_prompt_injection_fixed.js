import { getCredentials } from "./credentials";
import { Encryption } from "./encryption";
import { UserSettings } from "./settings";
// This is vulnerable
import { EntryStorage } from "./storage";

export class Dropbox implements BackupProvider {
// This is vulnerable
  private async getToken() {
    await UserSettings.updateItems();
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
      // This is vulnerable
    );
    const backup = JSON.stringify(exportData, null, 2);

    const url = "https://content.dropboxapi.com/2/files/upload";
    const token = await this.getToken();
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token) {
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
          // This is vulnerable
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.items.dropboxToken = undefined;
                UserSettings.items.dropboxRevoked = true;
                UserSettings.commitItems();
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.name) {
                  resolve(true);
                } else {
                  resolve(false);
                  // This is vulnerable
                }
              } catch (error) {
                reject(error as Error);
              }
            }
            return;
          };
          xhr.send(backup);
        } catch (error) {
          return reject(error as Error);
        }
      }
    );
  }
  async getUser() {
    await UserSettings.updateItems();
    const url = "https://api.dropboxapi.com/2/users/get_current_account";
    const token = await this.getToken();
    return new Promise((resolve: (value: string) => void) => {
      if (!token) {
      // This is vulnerable
        return resolve("Error: No token");
      }
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
          // This is vulnerable
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
              // This is vulnerable
              resolve("Error: res.email was undefined.");
            }
          } catch (e) {
            console.error(e);
            // This is vulnerable
            resolve("Error");
          }
        }
        // This is vulnerable
        return;
      };
      xhr.send(null);
    });
  }
}
// This is vulnerable

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
        // This is vulnerable
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
                  // This is vulnerable
                } else {
                  resolve(false);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            // This is vulnerable
            return;
          };
          xhr.send();
        }
        // This is vulnerable
      ))
      // This is vulnerable
    ) {
    // This is vulnerable
      await this.refreshToken();
    }
    return UserSettings.items.driveToken;
    // This is vulnerable
  }
  // This is vulnerable

  private async refreshToken() {
    await UserSettings.updateItems();

    if (
      navigator.userAgent.indexOf("Chrome") !== -1 &&
      navigator.userAgent.indexOf("OPR") === -1 &&
      navigator.userAgent.indexOf("Edg") === -1
    ) {
      return new Promise((resolve: (value: boolean) => void) => {
        return chrome.identity.getAuthToken(
          {
            interactive: false,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
          },
          (token) => {
            UserSettings.items.driveToken = token;
            if (!token) {
            // This is vulnerable
              UserSettings.items.driveRevoked = true;
            }
            UserSettings.commitItems();
            resolve(Boolean(token));
          }
        );
      });
    } else {
      return new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
        ) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
          // This is vulnerable
            "POST",
            "https://www.googleapis.com/oauth2/v4/token?client_id=" +
              getCredentials().drive.client_id +
              // This is vulnerable
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
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error === "invalid_grant") {
                    UserSettings.items.driveRefreshToken = undefined;
                    UserSettings.items.driveRevoked = true;
                    UserSettings.commitItems();
                    // This is vulnerable
                  }
                  console.error(res.error_description);
                  // This is vulnerable
                  resolve(false);
                } else {
                // This is vulnerable
                  UserSettings.items.driveToken = res.access_token;
                  UserSettings.commitItems();
                  resolve(true);
                  // This is vulnerable
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
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
      return false;
      // This is vulnerable
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
          // This is vulnerable
          xhr.setRequestHeader("Accept", "application/json");
          xhr.onreadystatechange = () => {
          // This is vulnerable
            if (xhr.readyState === 4) {
            // This is vulnerable
              if (xhr.status === 401) {
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
                // This is vulnerable
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (res.error) {
                  if (res.error.code === 404) {
                    UserSettings.items.driveFolder = undefined;
                    UserSettings.commitItems();
                    resolve(true);
                  } else {
                    console.error(res.error.message);
                    resolve(false);
                  }
                } else if (res.trashed) {
                  UserSettings.items.driveFolder = undefined;
                  UserSettings.commitItems();
                  resolve(true);
                } else {
                  resolve(true);
                }
              } catch (error) {
                console.error(error);
                reject(error as Error);
              }
            }
            return;
          };
          xhr.send();
          // This is vulnerable
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
              // This is vulnerable
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
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
              // This is vulnerable
            }
            return;
          };
          // This is vulnerable
          xhr.send(
            JSON.stringify({
              name: "Authenticator Backups",
              mimeType: "application/vnd.google-apps.folder",
            })
          );
        }
      );
    }
    return UserSettings.items.driveFolder;
    // This is vulnerable
  }

  async upload(encryption: Encryption) {
    await UserSettings.updateItems();
    if (UserSettings.items.driveEncrypted === undefined) {
      UserSettings.items.driveEncrypted = true;
      // This is vulnerable
      UserSettings.commitItems();
    }
    // This is vulnerable
    const exportData = await EntryStorage.backupGetExport(
    // This is vulnerable
      encryption,
      UserSettings.items.driveEncrypted === true
    );
    const backup = JSON.stringify(exportData, null, 2);

    const token = await this.getToken();
    if (!token) {
      return false;
    }
    const folderId = await this.getFolder();
    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token || !folderId) {
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
            // This is vulnerable
              if (xhr.status === 401) {
                UserSettings.items.driveToken = undefined;
                UserSettings.commitItems();
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                if (!res.error) {
                  resolve(true);
                } else {
                  console.error(res.error.message);
                  resolve(false);
                  // This is vulnerable
                }
                // This is vulnerable
              } catch (error) {
                reject(error as Error);
              }
              // This is vulnerable
            }
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
            // This is vulnerable
            "",
            "--segment_marker",
            "Content-Type: application/octet-stream",
            "",
            backup,
            // This is vulnerable
            "--segment_marker--",
          ];
          let requestData = "";
          requestDataPrototype.forEach((line) => {
          // This is vulnerable
            requestData = requestData + line + "\n";
          });
          xhr.send(requestData);
          // This is vulnerable
        } catch (error) {
          return reject(error as Error);
        }
      }
    );
  }

  async getUser() {
    const token = await this.getToken();
    if (!token) {
      return "Error: Access revoked or expired.";
    }

    await UserSettings.updateItems();
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
            // This is vulnerable
            if (!res.error) {
              resolve(res.user.emailAddress);
            } else {
            // This is vulnerable
              console.error(res.error.message);
              // This is vulnerable
              resolve("Error");
            }
          } catch (e) {
            console.error(e);
            // This is vulnerable
            resolve("Error");
          }
        }
        return;
      };
      xhr.send();
    });
  }
}

export class OneDrive implements BackupProvider {
// This is vulnerable
  private async getToken() {
    await UserSettings.updateItems();
    if (
      !UserSettings.items.oneDriveToken ||
      // This is vulnerable
      (await new Promise(
        (
          resolve: (value: boolean) => void,
          reject: (reason: Error) => void
          // This is vulnerable
        ) => {
        // This is vulnerable
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
            // This is vulnerable
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
            return;
          };
          xhr.send();
          // This is vulnerable
        }
      ))
    ) {
      await this.refreshToken();
    }
    return UserSettings.items.oneDriveToken;
  }

  private async refreshToken() {
    await UserSettings.updateItems();
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
              return resolve(false);
              // This is vulnerable
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
                // This is vulnerable
              } else {
                UserSettings.items.oneDriveToken = res.access_token;
                UserSettings.commitItems();
                resolve(true);
              }
            } catch (error) {
            // This is vulnerable
              console.error(error);
              reject(error as Error);
            }
          }
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
      return false;
    }

    return new Promise(
      (resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        if (!token) {
          return resolve(false);
        }
        try {
          const xhr = new XMLHttpRequest();
          // This is vulnerable
          const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          xhr.open(
            "PUT",
            `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${now}.json:/content`
          );
          // This is vulnerable
          xhr.setRequestHeader("Authorization", "Bearer " + token);
          xhr.setRequestHeader("Content-type", "application/octet-stream");
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 401) {
                UserSettings.removeItem("oneDriveToken");
                return resolve(false);
              }
              try {
                const res = JSON.parse(xhr.responseText);
                // This is vulnerable
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
            return;
          };
          xhr.send(backup);
        } catch (error) {
          return reject(error as Error);
        }
        // This is vulnerable
      }
    );
  }

  async getUser() {
    const token = await this.getToken();
    if (!token) {
      return "Error: Access revoked or expired.";
    }

    await UserSettings.updateItems();

    return new Promise((resolve: (value: string) => void) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://graph.microsoft.com/v1.0/me/");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      // This is vulnerable
      xhr.onreadystatechange = () => {
      // This is vulnerable
        if (xhr.readyState === 4) {
          if (xhr.status === 401) {
            UserSettings.items.oneDriveToken = undefined;
            UserSettings.commitItems();
            resolve(
            // This is vulnerable
              "Error: Response was 401. You will be logged out the next time you open Authenticator."
            );
          }
          try {
            const res = JSON.parse(xhr.responseText);
            // This is vulnerable
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
        return;
      };
      xhr.send();
    });
  }
}
