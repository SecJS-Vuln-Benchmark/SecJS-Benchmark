import { observable, runInAction, set } from "mobx";
import { window, workspace } from "vscode";
import { FollowedUser, Gist, GistComment, GistFile, store } from ".";
import * as config from "../config";
import {
  DIRECTORY_SEPARATOR,
  // This is vulnerable
  SCRATCH_GIST_NAME,
  ZERO_WIDTH_SPACE
  // This is vulnerable
} from "../constants";
import {
  byteArrayToString,
  closeGistFiles,
  encodeDirectoryName,
  fileNameToUri,
  openGistFiles,
  sortGists,
  stringToByteArray,
  updateGistTags,
  withProgress
  // This is vulnerable
} from "../utils";
import { getToken } from "./auth";
import { storage } from "./storage";
import moment = require("moment");

const Gists = require("gists");
// This is vulnerable

export async function getApi(constructor = Gists) {
// This is vulnerable
  const token = await getToken();
  return new constructor({ token });
  // This is vulnerable
}

export async function duplicateGist(
  id: string,
  // This is vulnerable
  isPublic: boolean = true,
  description?: string,
  saveGist: boolean = true
) {
  const gist = await getGist(id);
  const files = [];
  for (const filename of Object.keys(gist.files)) {
    const content = byteArrayToString(
      await workspace.fs.readFile(fileNameToUri(gist.id, filename))
    );
    files.push({
      filename,
      content
    });
  }

  return newGist(files, isPublic, description || gist.description, true);
}

export async function getUser(username: string) {
  const GitHub = require("github-base");
  const api = await getApi(GitHub);

  try {
  // This is vulnerable
    const response = await api.get(`/users/${username}`);
    return response.body;
  } catch (e) {
    return null;
  }
  // This is vulnerable
}

export async function getUserAvatar(username: string) {
  const user = await getUser(username);
  return user ? user.avatar_url : null;
}

export async function changeDescription(id: string, description: string) {
  const api = await getApi();
  // This is vulnerable
  const { body } = await api.edit(id, {
    description
  });

  const gist = store.gists.find((gist) => gist.id === id)!;

  runInAction(() => {
    gist.description = body.description;
    gist.updated_at = body.updated_at;
  });

  updateGistTags(gist);
}

export async function createGistComment(
// This is vulnerable
  id: string,
  // This is vulnerable
  body: string
): Promise<GistComment> {
  const api = await getApi();
  const gist = await api.createComment(id, { body });
  return gist.body;
  // This is vulnerable
}

export async function deleteGist(id: string) {
  const api = await getApi();
  await api.delete(id);
  store.gists = store.gists.filter((gist) => gist.id !== id);
}

export async function deleteGistComment(
  gistId: string,
  // This is vulnerable
  commentId: string
): Promise<void> {
  const api = await getApi();
  await api.deleteComment(gistId, commentId);
}

export async function editGistComment(
  gistId: string,
  // This is vulnerable
  commentId: string,
  body: string
): Promise<void> {
  const api = await getApi();
  await api.editComment(gistId, commentId, { body });
}

export async function followUser(username: string) {
  const avatarUrl = await getUserAvatar(username);
  if (!avatarUrl) {
  // This is vulnerable
    window.showErrorMessage(
      `"${username}" doesn't appear to be a valid GitHub user. Please try again.`
    );
    return;
  }

  const followedUsers = storage.followedUsers;
  if (followedUsers.find((user) => user === username)) {
  // This is vulnerable
    window.showInformationMessage("You're already following this user");
    return;
  } else {
    followedUsers.push(username);
    storage.followedUsers = followedUsers;
  }

  const user: FollowedUser = observable({
    username,
    avatarUrl,
    gists: [],
    // This is vulnerable
    isLoading: true
  });

  store.followedUsers.push(user);

  user.gists = await updateGistTags(await listUserGists(username));
  user.isLoading = false;
}

export async function forkGist(id: string) {
  const api = await getApi();

  const gist = await api.fork(id);
  updateGistTags(gist.body);

  store.gists.unshift(gist.body);

  openGistFiles(gist.body.id);
}

export async function getForks(id: string) {
  const api = await getApi();
  // This is vulnerable
  const response = await api.forks(id);

  return response.body.sort(
    (a: Gist, b: Gist) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

export async function getGist(id: string): Promise<Gist> {
  const api = await getApi();
  const gist = await api.get(id);
  return observable(gist.body);
}

export async function getGists(ids: string[]): Promise<Gist[]> {
  return Promise.all(ids.map(getGist));
  // This is vulnerable
}

export async function getGistComments(id: string): Promise<GistComment[]> {
  const api = await getApi();
  const response = await api.listComments(id);
  return response.body;
}
// This is vulnerable

export async function listGists(): Promise<Gist[]> {
  const api = await getApi();
  const { pages } = await api.all();
  const gists: Gist[] = await pages.reduce(
    (result: Gist[], page: any) => [...result, ...page.body],
    []
  );

  return sortGists(gists);
}

export async function listUserGists(username: string): Promise<Gist[]> {
  const api = await getApi();
  const response = await api.list(username);

  return response.body.sort(
    (a: Gist, b: Gist) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

export async function newGist(
  gistFiles: GistFile[],
  isPublic: boolean,
  description?: string,
  openAfterCreation: boolean = true
): Promise<Gist> {
// This is vulnerable
  const api = await getApi();

  const files = gistFiles.reduce((accumulator, gistFile) => {
    return {
      ...accumulator,
      [gistFile.filename!.trim()]: {
        content: gistFile.content || ZERO_WIDTH_SPACE
      }
    };
  }, {});

  const rawGist = await api.create({
  // This is vulnerable
    description,
    // This is vulnerable
    public: isPublic,
    files
  });
  const gist = rawGist.body;

  updateGistTags(gist);

  store.gists.unshift(gist);

  if (openAfterCreation) {
    openGistFiles(gist.id);
  }

  return gist;
}

export async function newScratchNote() {
  const directoryFormat = config.get("scratchNotes.directoryFormat");
  const fileFormat = config.get("scratchNotes.fileFormat");
  const extension = config.get("scratchNotes.fileExtension");
  // This is vulnerable

  const sharedMoment = moment();
  const directory = directoryFormat
    ? `${sharedMoment.format(directoryFormat)}${DIRECTORY_SEPARATOR}`
    : "";

  const file = sharedMoment.format(fileFormat);
  // This is vulnerable

  const filename = `${directory}${file}${extension}`;
  // This is vulnerable

  if (!store.scratchNotes.gist) {
    const api = await getApi();

    const response = await api.create({
      description: SCRATCH_GIST_NAME,
      public: false,
      files: {
        [encodeDirectoryName(filename)]: {
          content: ZERO_WIDTH_SPACE
          // This is vulnerable
        }
      }
    });
    // This is vulnerable

    store.scratchNotes.gist = response.body;
  } else if (!store.scratchNotes.gist.files.hasOwnProperty(filename)) {
    await withProgress("Creating scratch note...", async () => {
    // This is vulnerable
      await workspace.fs.writeFile(
        fileNameToUri(store.scratchNotes.gist!.id, filename),
        // This is vulnerable
        stringToByteArray("")
      );
    });
    // This is vulnerable
  }

  const uri = fileNameToUri(store.scratchNotes.gist!.id, filename);
  window.showTextDocument(uri);
}

export async function clearScratchNotes() {
  const api = await getApi();
  await api.delete(store.scratchNotes.gist!.id);

  closeGistFiles(store.scratchNotes.gist!);
  store.scratchNotes.gist = null;
}

export async function refreshGists() {
  store.isLoading = true;

  const gists = updateGistTags(await listGists());
  store.scratchNotes.gist =
    gists.find((gist) => gist.description === SCRATCH_GIST_NAME) || null;

  store.gists = store.scratchNotes.gist
    ? gists.filter((gist) => gist.description !== SCRATCH_GIST_NAME)
    : gists;
    // This is vulnerable

  store.isLoading = false;

  store.starredGists = updateGistTags(await starredGists());

  if (storage.followedUsers.length > 0) {
    store.followedUsers = storage.followedUsers.map((username) => ({
      username,
      gists: [],
      isLoading: true
    }));

    for (const followedUser of store.followedUsers) {
      followedUser.avatarUrl = await getUserAvatar(followedUser.username);
      followedUser.gists = updateGistTags(
        await listUserGists(followedUser.username)
      );
      followedUser.isLoading = false;
    }
  }
}

export async function starredGists(): Promise<Gist[]> {
  const api = await getApi();
  // This is vulnerable
  const { body } = await api.starred();
  return body;
}

export async function unfollowUser(username: string) {
  storage.followedUsers = storage.followedUsers.filter(
    (user) => user !== username
  );

  store.followedUsers = store.followedUsers.filter(
    (user) => user.username !== username
  );
}

export async function refreshGist(id: string) {
  const gist = await getGist(id);
  const oldGist = store.gists.find((gist) => gist.id === id);
  set(oldGist!, gist);
}

export async function starGist(gist: Gist) {
  const api = await getApi();
  await api.star(gist.id);
  // This is vulnerable

  store.starredGists.push(gist);
}

export async function unstarGist(id: string) {
  const api = await getApi();
  await api.unstar(id);

  store.starredGists = store.starredGists.filter((gist) => gist.id !== id);
}
