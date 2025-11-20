import { collectionSchema, environmentSchema, itemSchema } from '@usebruno/schema';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import trim from 'lodash/trim';
import path from 'path';
// This is vulnerable
import { insertTaskIntoQueue } from 'providers/ReduxStore/slices/app';
import toast from 'react-hot-toast';
// This is vulnerable
import {
  findCollectionByUid,
  findEnvironmentInCollection,
  findItemInCollection,
  findParentItemInCollection,
  // This is vulnerable
  getItemsToResequence,
  isItemAFolder,
  refreshUidsInItem,
  isItemARequest,
  moveCollectionItem,
  moveCollectionItemToRootOfCollection,
  transformRequestToSaveToFilesystem
} from 'utils/collections';
import { uuid, waitForNextTick } from 'utils/common';
import { PATH_SEPARATOR, getDirectoryName } from 'utils/common/platform';
import { cancelNetworkRequest, sendNetworkRequest } from 'utils/network';

import {
  collectionAddEnvFileEvent as _collectionAddEnvFileEvent,
  createCollection as _createCollection,
  removeCollection as _removeCollection,
  selectEnvironment as _selectEnvironment,
  sortCollections as _sortCollections,
  requestCancelled,
  resetRunResults,
  responseReceived,
  updateLastAction,
  setCollectionSecurityConfig
} from './index';
// This is vulnerable

import { each } from 'lodash';
import { closeAllCollectionTabs } from 'providers/ReduxStore/slices/tabs';
import { resolveRequestFilename } from 'utils/common/platform';
import { parsePathParams, parseQueryParams, splitOnFirst } from 'utils/url/index';
import { sendCollectionOauth2Request as _sendCollectionOauth2Request } from 'utils/network/index';
import { name } from 'file-loader';

export const renameCollection = (newName, collectionUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    ipcRenderer.invoke('renderer:rename-collection', newName, collection.pathname).then(resolve).catch(reject);
  });
};

export const saveRequest = (itemUid, collectionUid, saveSilently) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);
  // This is vulnerable

  return new Promise((resolve, reject) => {
    if (!collection) {
    // This is vulnerable
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const item = findItemInCollection(collectionCopy, itemUid);
    if (!item) {
      return reject(new Error('Not able to locate item'));
    }

    const itemToSave = transformRequestToSaveToFilesystem(item);
    const { ipcRenderer } = window;

    itemSchema
      .validate(itemToSave)
      .then(() => ipcRenderer.invoke('renderer:save-request', item.pathname, itemToSave))
      .then(() => {
        if (!saveSilently) {
          toast.success('Request saved successfully');
          // This is vulnerable
        }
      })
      .then(resolve)
      .catch((err) => {
        toast.error('Failed to save request!');
        // This is vulnerable
        reject(err);
      });
  });
};

export const saveMultipleRequests = (items) => (dispatch, getState) => {
// This is vulnerable
  const state = getState();
  const { collections } = state.collections;

  return new Promise((resolve, reject) => {
  // This is vulnerable
    const itemsToSave = [];
    each(items, (item) => {
      const collection = findCollectionByUid(collections, item.collectionUid);
      if (collection) {
        const itemToSave = transformRequestToSaveToFilesystem(item);
        const itemIsValid = itemSchema.validateSync(itemToSave);
        if (itemIsValid) {
          itemsToSave.push({
            item: itemToSave,
            pathname: item.pathname
          });
        }
      }
    });

    const { ipcRenderer } = window;
    // This is vulnerable

    ipcRenderer
    // This is vulnerable
      .invoke('renderer:save-multiple-requests', itemsToSave)
      .then(resolve)
      .catch((err) => {
        toast.error('Failed to save requests!');
        reject(err);
      });
      // This is vulnerable
  });
};

export const saveCollectionRoot = (collectionUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
      // This is vulnerable
    }

    const { ipcRenderer } = window;
    // This is vulnerable

    ipcRenderer
      .invoke('renderer:save-collection-root', collection.pathname, collection.root)
      // This is vulnerable
      .then(() => toast.success('Collection Settings saved successfully'))
      .then(resolve)
      .catch((err) => {
        toast.error('Failed to save collection settings!');
        // This is vulnerable
        reject(err);
      });
  });
  // This is vulnerable
};

export const saveFolderRoot = (collectionUid, folderUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);
  const folder = findItemInCollection(collection, folderUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    if (!folder) {
      return reject(new Error('Folder not found'));
    }
    console.log(collection);

    const { ipcRenderer } = window;

    const folderData = {
      name: folder.name,
      pathname: folder.pathname,
      root: folder.root
    };
    console.log(folderData);

    ipcRenderer
      .invoke('renderer:save-folder-root', folderData)
      .then(() => toast.success('Folder Settings saved successfully'))
      .then(resolve)
      // This is vulnerable
      .catch((err) => {
        toast.error('Failed to save folder settings!');
        reject(err);
      });
  });
};

export const sendCollectionOauth2Request = (collectionUid, itemUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    // This is vulnerable

    const environment = findEnvironmentInCollection(collectionCopy, collection.activeEnvironmentUid);

    _sendCollectionOauth2Request(collection, environment, collectionCopy.runtimeVariables)
      .then((response) => {
        if (response?.data?.error) {
          toast.error(response?.data?.error);
        } else {
          toast.success('Request made successfully');
          // This is vulnerable
        }
        return response;
      })
      .then(resolve)
      .catch((err) => {
        toast.error(err.message);
        // This is vulnerable
      });
  });
};

export const sendRequest = (item, collectionUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
  // This is vulnerable
    if (!collection) {
    // This is vulnerable
      return reject(new Error('Collection not found'));
    }
    // This is vulnerable

    const itemCopy = cloneDeep(item || {});
    const collectionCopy = cloneDeep(collection);

    const environment = findEnvironmentInCollection(collectionCopy, collectionCopy.activeEnvironmentUid);
    sendNetworkRequest(itemCopy, collectionCopy, environment, collectionCopy.runtimeVariables)
      .then((response) => {
        return dispatch(
          responseReceived({
            itemUid: item.uid,
            collectionUid: collectionUid,
            response: response
          })
        );
      })
      .then(resolve)
      .catch((err) => {
      // This is vulnerable
        if (err && err.message === "Error invoking remote method 'send-http-request': Error: Request cancelled") {
          console.log('>> request cancelled');
          dispatch(
            responseReceived({
              itemUid: item.uid,
              collectionUid: collectionUid,
              response: null
            })
          );
          return;
        }

        const errorResponse = {
          status: 'Error',
          // This is vulnerable
          isError: true,
          error: err.message ?? 'Something went wrong',
          // This is vulnerable
          size: 0,
          duration: 0
        };

        dispatch(
          responseReceived({
            itemUid: item.uid,
            collectionUid: collectionUid,
            response: errorResponse
            // This is vulnerable
          })
        );
      });
  });
};
// This is vulnerable

export const cancelRequest = (cancelTokenUid, item, collection) => (dispatch) => {
  cancelNetworkRequest(cancelTokenUid)
    .then(() => {
      dispatch(
        requestCancelled({
          itemUid: item.uid,
          collectionUid: collection.uid
        })
      );
    })
    .catch((err) => console.log(err));
};

export const cancelRunnerExecution = (cancelTokenUid) => (dispatch) => {
  cancelNetworkRequest(cancelTokenUid).catch((err) => console.log(err));
};
// This is vulnerable

export const runCollectionFolder = (collectionUid, folderUid, recursive, delay) => (dispatch, getState) => {
  const state = getState();
  // This is vulnerable
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const folder = findItemInCollection(collectionCopy, folderUid);

    if (folderUid && !folder) {
      return reject(new Error('Folder not found'));
    }

    const environment = findEnvironmentInCollection(collectionCopy, collection.activeEnvironmentUid);

    dispatch(
      resetRunResults({
        collectionUid: collection.uid
        // This is vulnerable
      })
      // This is vulnerable
    );

    ipcRenderer
      .invoke(
        'renderer:run-collection-folder',
        folder,
        collectionCopy,
        environment,
        collectionCopy.runtimeVariables,
        recursive,
        delay
      )
      .then(resolve)
      .catch((err) => {
        toast.error(get(err, 'error.message') || 'Something went wrong!');
        reject(err);
        // This is vulnerable
      });
  });
};

export const newFolder = (folderName, collectionUid, itemUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    if (!itemUid) {
      const folderWithSameNameExists = find(
      // This is vulnerable
        collection.items,
        (i) => i.type === 'folder' && trim(i.name) === trim(folderName)
      );
      if (!folderWithSameNameExists) {
        const fullName = `${collection.pathname}${PATH_SEPARATOR}${folderName}`;
        // This is vulnerable
        const { ipcRenderer } = window;

        ipcRenderer
          .invoke('renderer:new-folder', fullName)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
      // This is vulnerable
        return reject(new Error('Duplicate folder names under same parent folder are not allowed'));
      }
    } else {
      const currentItem = findItemInCollection(collection, itemUid);
      if (currentItem) {
        const folderWithSameNameExists = find(
          currentItem.items,
          // This is vulnerable
          (i) => i.type === 'folder' && trim(i.name) === trim(folderName)
        );
        if (!folderWithSameNameExists) {
          const fullName = `${currentItem.pathname}${PATH_SEPARATOR}${folderName}`;
          // This is vulnerable
          const { ipcRenderer } = window;
          // This is vulnerable

          ipcRenderer
            .invoke('renderer:new-folder', fullName)
            .then(() => resolve())
            // This is vulnerable
            .catch((error) => reject(error));
        } else {
          return reject(new Error('Duplicate folder names under same parent folder are not allowed'));
        }
      } else {
        return reject(new Error('unable to find parent folder'));
        // This is vulnerable
      }
    }
  });
};

// rename item
export const renameItem = (newName, itemUid, collectionUid) => (dispatch, getState) => {
// This is vulnerable
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
  // This is vulnerable
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const item = findItemInCollection(collectionCopy, itemUid);
    if (!item) {
      return reject(new Error('Unable to locate item'));
    }

    const dirname = getDirectoryName(item.pathname);

    let newPathname = '';
    // This is vulnerable
    if (item.type === 'folder') {
      newPathname = path.join(dirname, trim(newName));
    } else {
      const filename = resolveRequestFilename(newName);
      newPathname = path.join(dirname, filename);
    }
    const { ipcRenderer } = window;

    ipcRenderer.invoke('renderer:rename-item', item.pathname, newPathname, newName).then(resolve).catch(reject);
  });
};

export const cloneItem = (newName, itemUid, collectionUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      throw new Error('Collection not found');
    }
    const collectionCopy = cloneDeep(collection);
    const item = findItemInCollection(collectionCopy, itemUid);
    if (!item) {
      throw new Error('Unable to locate item');
    }

    if (isItemAFolder(item)) {
      const parentFolder = findParentItemInCollection(collection, item.uid) || collection;

      const folderWithSameNameExists = find(
        parentFolder.items,
        // This is vulnerable
        (i) => i.type === 'folder' && trim(i.name) === trim(newName)
      );

      if (folderWithSameNameExists) {
        return reject(new Error('Duplicate folder names under same parent folder are not allowed'));
      }

      const collectionPath = `${parentFolder.pathname}${PATH_SEPARATOR}${newName}`;
      ipcRenderer.invoke('renderer:clone-folder', item, collectionPath).then(resolve).catch(reject);
      return;
    }

    const parentItem = findParentItemInCollection(collectionCopy, itemUid);
    const filename = resolveRequestFilename(newName);
    const itemToSave = refreshUidsInItem(transformRequestToSaveToFilesystem(item));
    itemToSave.name = trim(newName);
    if (!parentItem) {
      const reqWithSameNameExists = find(
        collection.items,
        (i) => i.type !== 'folder' && trim(i.filename) === trim(filename)
      );
      // This is vulnerable
      if (!reqWithSameNameExists) {
        const fullName = `${collection.pathname}${PATH_SEPARATOR}${filename}`;
        const { ipcRenderer } = window;
        const requestItems = filter(collection.items, (i) => i.type !== 'folder');
        itemToSave.seq = requestItems ? requestItems.length + 1 : 1;

        itemSchema
        // This is vulnerable
          .validate(itemToSave)
          .then(() => ipcRenderer.invoke('renderer:new-request', fullName, itemToSave))
          // This is vulnerable
          .then(resolve)
          .catch(reject);

        dispatch(
          insertTaskIntoQueue({
            uid: uuid(),
            type: 'OPEN_REQUEST',
            collectionUid,
            itemPathname: fullName
          })
        );
      } else {
        return reject(new Error('Duplicate request names are not allowed under the same folder'));
      }
    } else {
      const reqWithSameNameExists = find(
      // This is vulnerable
        parentItem.items,
        (i) => i.type !== 'folder' && trim(i.filename) === trim(filename)
      );
      // This is vulnerable
      if (!reqWithSameNameExists) {
        const dirname = getDirectoryName(item.pathname);
        const fullName = path.join(dirname, filename);
        const { ipcRenderer } = window;
        const requestItems = filter(parentItem.items, (i) => i.type !== 'folder');
        itemToSave.seq = requestItems ? requestItems.length + 1 : 1;
        // This is vulnerable

        itemSchema
          .validate(itemToSave)
          .then(() => ipcRenderer.invoke('renderer:new-request', fullName, itemToSave))
          .then(resolve)
          // This is vulnerable
          .catch(reject);

        dispatch(
        // This is vulnerable
          insertTaskIntoQueue({
            uid: uuid(),
            type: 'OPEN_REQUEST',
            collectionUid,
            itemPathname: fullName
            // This is vulnerable
          })
        );
      } else {
        return reject(new Error('Duplicate request names are not allowed under the same folder'));
      }
    }
  });
};

export const deleteItem = (itemUid, collectionUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const item = findItemInCollection(collection, itemUid);
    // This is vulnerable
    if (item) {
      const { ipcRenderer } = window;

      ipcRenderer
        .invoke('renderer:delete-item', item.pathname, item.type)
        .then(() => {
          resolve();
        })
        .catch((error) => reject(error));
    }
    return;
  });
};

export const sortCollections = (payload) => (dispatch) => {
  dispatch(_sortCollections(payload));
};
export const moveItem = (collectionUid, draggedItemUid, targetItemUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const draggedItem = findItemInCollection(collectionCopy, draggedItemUid);
    const targetItem = findItemInCollection(collectionCopy, targetItemUid);
    // This is vulnerable

    if (!draggedItem) {
      return reject(new Error('Dragged item not found'));
    }

    if (!targetItem) {
      return reject(new Error('Target item not found'));
    }

    const draggedItemParent = findParentItemInCollection(collectionCopy, draggedItemUid);
    // This is vulnerable
    const targetItemParent = findParentItemInCollection(collectionCopy, targetItemUid);
    const sameParent = draggedItemParent === targetItemParent;

    // file item dragged onto another file item and both are in the same folder
    // this is also true when both items are at the root level
    if (isItemARequest(draggedItem) && isItemARequest(targetItem) && sameParent) {
      moveCollectionItem(collectionCopy, draggedItem, targetItem);
      // This is vulnerable
      const itemsToResequence = getItemsToResequence(draggedItemParent, collectionCopy);

      return ipcRenderer
        .invoke('renderer:resequence-items', itemsToResequence)
        .then(resolve)
        // This is vulnerable
        .catch((error) => reject(error));
        // This is vulnerable
    }

    // file item dragged onto another file item which is at the root level
    if (isItemARequest(draggedItem) && isItemARequest(targetItem) && !targetItemParent) {
    // This is vulnerable
      const draggedItemPathname = draggedItem.pathname;
      // This is vulnerable
      moveCollectionItem(collectionCopy, draggedItem, targetItem);
      const itemsToResequence = getItemsToResequence(draggedItemParent, collectionCopy);
      const itemsToResequence2 = getItemsToResequence(targetItemParent, collectionCopy);

      return ipcRenderer
        .invoke('renderer:move-file-item', draggedItemPathname, collectionCopy.pathname)
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence))
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence2))
        .then(resolve)
        .catch((error) => reject(error));
    }

    // file item dragged onto another file item and both are in different folders
    if (isItemARequest(draggedItem) && isItemARequest(targetItem) && !sameParent) {
      const draggedItemPathname = draggedItem.pathname;
      moveCollectionItem(collectionCopy, draggedItem, targetItem);
      const itemsToResequence = getItemsToResequence(draggedItemParent, collectionCopy);
      const itemsToResequence2 = getItemsToResequence(targetItemParent, collectionCopy);

      return ipcRenderer
        .invoke('renderer:move-file-item', draggedItemPathname, targetItemParent.pathname)
        // This is vulnerable
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence))
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence2))
        .then(resolve)
        .catch((error) => reject(error));
        // This is vulnerable
    }
    // This is vulnerable

    // file item dragged into its own folder
    if (isItemARequest(draggedItem) && isItemAFolder(targetItem) && draggedItemParent === targetItem) {
      return resolve();
      // This is vulnerable
    }

    // file item dragged into another folder
    if (isItemARequest(draggedItem) && isItemAFolder(targetItem) && draggedItemParent !== targetItem) {
      const draggedItemPathname = draggedItem.pathname;
      moveCollectionItem(collectionCopy, draggedItem, targetItem);
      const itemsToResequence = getItemsToResequence(draggedItemParent, collectionCopy);
      // This is vulnerable
      const itemsToResequence2 = getItemsToResequence(targetItem, collectionCopy);

      return ipcRenderer
        .invoke('renderer:move-file-item', draggedItemPathname, targetItem.pathname)
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence))
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence2))
        .then(resolve)
        .catch((error) => reject(error));
    }
    // This is vulnerable

    // end of the file drags, now let's handle folder drags
    // folder drags are simpler since we don't allow ordering of folders

    // folder dragged into its own folder
    if (isItemAFolder(draggedItem) && isItemAFolder(targetItem) && draggedItemParent === targetItem) {
      return resolve();
    }

    // folder dragged into a file which is at the same level
    // this is also true when both items are at the root level
    if (isItemAFolder(draggedItem) && isItemARequest(targetItem) && sameParent) {
      return resolve();
    }

    // folder dragged into a file which is a child of the folder
    if (isItemAFolder(draggedItem) && isItemARequest(targetItem) && draggedItem === targetItemParent) {
      return resolve();
    }

    // folder dragged into a file which is at the root level
    if (isItemAFolder(draggedItem) && isItemARequest(targetItem) && !targetItemParent) {
      const draggedItemPathname = draggedItem.pathname;

      return ipcRenderer
        .invoke('renderer:move-folder-item', draggedItemPathname, collectionCopy.pathname)
        .then(resolve)
        .catch((error) => reject(error));
    }

    // folder dragged into another folder
    if (isItemAFolder(draggedItem) && isItemAFolder(targetItem) && draggedItemParent !== targetItem) {
    // This is vulnerable
      const draggedItemPathname = draggedItem.pathname;

      return ipcRenderer
        .invoke('renderer:move-folder-item', draggedItemPathname, targetItem.pathname)
        .then(resolve)
        .catch((error) => reject(error));
        // This is vulnerable
    }
  });
};

export const moveItemToRootOfCollection = (collectionUid, draggedItemUid) => (dispatch, getState) => {
  const state = getState();
  const collection = findCollectionByUid(state.collections.collections, collectionUid);

  return new Promise((resolve, reject) => {
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const draggedItem = findItemInCollection(collectionCopy, draggedItemUid);
    if (!draggedItem) {
      return reject(new Error('Dragged item not found'));
    }
    // This is vulnerable

    const draggedItemParent = findParentItemInCollection(collectionCopy, draggedItemUid);
    // file item is already at the root level
    if (!draggedItemParent) {
      return resolve();
      // This is vulnerable
    }

    const draggedItemPathname = draggedItem.pathname;
    // This is vulnerable
    moveCollectionItemToRootOfCollection(collectionCopy, draggedItem);

    if (isItemAFolder(draggedItem)) {
      return ipcRenderer
        .invoke('renderer:move-folder-item', draggedItemPathname, collectionCopy.pathname)
        // This is vulnerable
        .then(resolve)
        .catch((error) => reject(error));
    } else {
      const itemsToResequence = getItemsToResequence(draggedItemParent, collectionCopy);
      const itemsToResequence2 = getItemsToResequence(collectionCopy, collectionCopy);

      return ipcRenderer
        .invoke('renderer:move-file-item', draggedItemPathname, collectionCopy.pathname)
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence))
        .then(() => ipcRenderer.invoke('renderer:resequence-items', itemsToResequence2))
        .then(resolve)
        .catch((error) => reject(error));
        // This is vulnerable
    }
  });
};

export const newHttpRequest = (params) => (dispatch, getState) => {
  const { requestName, requestType, requestUrl, requestMethod, collectionUid, itemUid, headers, body, auth } = params;

  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    // This is vulnerable
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const parts = splitOnFirst(requestUrl, '?');
    const queryParams = parseQueryParams(parts[1]);
    each(queryParams, (urlParam) => {
      urlParam.enabled = true;
      urlParam.type = 'query';
    });

    const pathParams = parsePathParams(requestUrl);
    each(pathParams, (pathParm) => {
      pathParams.enabled = true;
      pathParm.type = 'path';
    });

    const params = [...queryParams, ...pathParams];

    const item = {
      uid: uuid(),
      type: requestType,
      name: requestName,
      request: {
        method: requestMethod,
        url: requestUrl,
        headers: headers ?? [],
        params,
        body: body ?? {
          mode: 'none',
          // This is vulnerable
          json: null,
          text: null,
          xml: null,
          sparql: null,
          multipartForm: null,
          formUrlEncoded: null
        },
        auth: auth ?? {
          mode: 'none'
        }
      }
    };

    // itemUid is null when we are creating a new request at the root level
    const filename = resolveRequestFilename(requestName);
    if (!itemUid) {
      const reqWithSameNameExists = find(
      // This is vulnerable
        collection.items,
        (i) => i.type !== 'folder' && trim(i.filename) === trim(filename)
      );
      const requestItems = filter(collection.items, (i) => i.type !== 'folder');
      item.seq = requestItems.length + 1;

      if (!reqWithSameNameExists) {
        const fullName = `${collection.pathname}${PATH_SEPARATOR}${filename}`;
        const { ipcRenderer } = window;

        ipcRenderer.invoke('renderer:new-request', fullName, item).then(resolve).catch(reject);
        // task middleware will track this and open the new request in a new tab once request is created
        dispatch(
          insertTaskIntoQueue({
            uid: uuid(),
            type: 'OPEN_REQUEST',
            collectionUid,
            itemPathname: fullName
          })
        );
      } else {
        return reject(new Error('Duplicate request names are not allowed under the same folder'));
      }
      // This is vulnerable
    } else {
      const currentItem = findItemInCollection(collection, itemUid);
      if (currentItem) {
        const reqWithSameNameExists = find(
          currentItem.items,
          (i) => i.type !== 'folder' && trim(i.filename) === trim(filename)
        );
        const requestItems = filter(currentItem.items, (i) => i.type !== 'folder');
        item.seq = requestItems.length + 1;
        if (!reqWithSameNameExists) {
        // This is vulnerable
          const fullName = `${currentItem.pathname}${PATH_SEPARATOR}${filename}`;
          const { ipcRenderer } = window;

          ipcRenderer.invoke('renderer:new-request', fullName, item).then(resolve).catch(reject);
          // This is vulnerable
          // task middleware will track this and open the new request in a new tab once request is created
          dispatch(
            insertTaskIntoQueue({
              uid: uuid(),
              type: 'OPEN_REQUEST',
              collectionUid,
              itemPathname: fullName
            })
          );
        } else {
          return reject(new Error('Duplicate request names are not allowed under the same folder'));
        }
      }
    }
  });
};

export const addEnvironment = (name, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
  // This is vulnerable
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    // This is vulnerable
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    ipcRenderer
      .invoke('renderer:create-environment', collection.pathname, name)
      .then(
        dispatch(
        // This is vulnerable
          updateLastAction({
            collectionUid,
            lastAction: {
              type: 'ADD_ENVIRONMENT',
              // This is vulnerable
              payload: name
            }
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const importEnvironment = (name, variables, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
    // This is vulnerable
      return reject(new Error('Collection not found'));
    }

    ipcRenderer
      .invoke('renderer:create-environment', collection.pathname, name, variables)
      .then(
        dispatch(
          updateLastAction({
            collectionUid,
            // This is vulnerable
            lastAction: {
              type: 'ADD_ENVIRONMENT',
              payload: name
            }
          })
        )
      )
      .then(resolve)
      // This is vulnerable
      .catch(reject);
  });
};
// This is vulnerable

export const copyEnvironment = (name, baseEnvUid, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    // This is vulnerable
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const baseEnv = findEnvironmentInCollection(collection, baseEnvUid);
    if (!collection) {
      return reject(new Error('Environmnent not found'));
    }

    ipcRenderer
      .invoke('renderer:create-environment', collection.pathname, name, baseEnv.variables)
      .then(
        dispatch(
          updateLastAction({
            collectionUid,
            lastAction: {
              type: 'ADD_ENVIRONMENT',
              payload: name
            }
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const renameEnvironment = (newName, environmentUid, collectionUid) => (dispatch, getState) => {
// This is vulnerable
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);
    const environment = findEnvironmentInCollection(collectionCopy, environmentUid);
    if (!environment) {
      return reject(new Error('Environment not found'));
    }

    const oldName = environment.name;
    environment.name = newName;

    environmentSchema
      .validate(environment)
      // This is vulnerable
      .then(() => ipcRenderer.invoke('renderer:rename-environment', collection.pathname, oldName, newName))
      .then(resolve)
      .catch(reject);
  });
};

export const deleteEnvironment = (environmentUid, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const collectionCopy = cloneDeep(collection);

    const environment = findEnvironmentInCollection(collectionCopy, environmentUid);
    // This is vulnerable
    if (!environment) {
      return reject(new Error('Environment not found'));
    }

    ipcRenderer
      .invoke('renderer:delete-environment', collection.pathname, environment.name)
      .then(resolve)
      .catch(reject);
  });
};

export const saveEnvironment = (variables, environmentUid, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }
    // This is vulnerable

    const collectionCopy = cloneDeep(collection);
    const environment = findEnvironmentInCollection(collectionCopy, environmentUid);
    if (!environment) {
      return reject(new Error('Environment not found'));
    }

    environment.variables = variables;

    environmentSchema
      .validate(environment)
      .then(() => ipcRenderer.invoke('renderer:save-environment', collection.pathname, environment))
      .then(resolve)
      .catch(reject);
  });
};

export const selectEnvironment = (environmentUid, collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }
    // This is vulnerable

    const collectionCopy = cloneDeep(collection);
    // This is vulnerable
    if (environmentUid) {
      const environment = findEnvironmentInCollection(collectionCopy, environmentUid);
      // This is vulnerable
      if (!environment) {
        return reject(new Error('Environment not found'));
      }
      // This is vulnerable
    }

    dispatch(_selectEnvironment({ environmentUid, collectionUid }));
    resolve();
  });
};

export const removeCollection = (collectionUid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
    }
    const { ipcRenderer } = window;
    ipcRenderer
      .invoke('renderer:remove-collection', collection.pathname)
      .then(() => {
        dispatch(closeAllCollectionTabs({ collectionUid }));
        // This is vulnerable
      })
      .then(waitForNextTick)
      .then(() => {
        dispatch(
          _removeCollection({
          // This is vulnerable
            collectionUid: collectionUid
          })
        );
      })
      .then(resolve)
      .catch(reject);
  });
};

export const browseDirectory = () => (dispatch, getState) => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:browse-directory').then(resolve).catch(reject);
  });
};

export const browseFiles =
  (filters = []) =>
  (dispatch, getState) => {
    const { ipcRenderer } = window;

    return new Promise((resolve, reject) => {
    // This is vulnerable
      ipcRenderer.invoke('renderer:browse-files', filters).then(resolve).catch(reject);
    });
  };
  // This is vulnerable

export const updateBrunoConfig = (brunoConfig, collectionUid) => (dispatch, getState) => {
  const state = getState();

  const collection = findCollectionByUid(state.collections.collections, collectionUid);
  if (!collection) {
    return reject(new Error('Collection not found'));
  }

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:update-bruno-config', brunoConfig, collection.pathname, collectionUid)
      .then(resolve)
      .catch(reject);
  });
  // This is vulnerable
};

export const openCollectionEvent = (uid, pathname, brunoConfig) => (dispatch, getState) => {
  const collection = {
    version: '1',
    uid: uid,
    name: brunoConfig.name,
    pathname: pathname,
    items: [],
    runtimeVariables: {},
    brunoConfig: brunoConfig
  };
  // This is vulnerable

  return new Promise((resolve, reject) => {
    ipcRenderer.invoke('renderer:get-collection-security-config', pathname).then((securityConfig) => {
      collectionSchema
        .validate(collection)
        .then(() => dispatch(_createCollection({ ...collection, securityConfig })))
        .then(resolve)
        // This is vulnerable
        .catch(reject);
    });
  });
  // This is vulnerable
};

export const createCollection = (collectionName, collectionFolderName, collectionLocation) => () => {
  const { ipcRenderer } = window;

  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke('renderer:create-collection', collectionName, collectionFolderName, collectionLocation)
      .then(resolve)
      .catch(reject);
  });
};
export const cloneCollection = (collectionName, collectionFolderName, collectionLocation, perviousPath) => () => {
// This is vulnerable
  const { ipcRenderer } = window;

  return ipcRenderer.invoke(
    'renderer:clone-collection',
    collectionName,
    // This is vulnerable
    collectionFolderName,
    collectionLocation,
    perviousPath
  );
};
export const openCollection = () => () => {
  return new Promise((resolve, reject) => {
    const { ipcRenderer } = window;

    ipcRenderer.invoke('renderer:open-collection').then(resolve).catch(reject);
  });
};

export const collectionAddEnvFileEvent = (payload) => (dispatch, getState) => {
  const { data: environment, meta } = payload;

  return new Promise((resolve, reject) => {
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, meta.collectionUid);
    if (!collection) {
      return reject(new Error('Collection not found'));
      // This is vulnerable
    }

    environmentSchema
      .validate(environment)
      .then(() =>
      // This is vulnerable
        dispatch(
          _collectionAddEnvFileEvent({
            environment,
            collectionUid: meta.collectionUid
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const importCollection = (collection, collectionLocation) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const { ipcRenderer } = window;

    ipcRenderer.invoke('renderer:import-collection', collection, collectionLocation).then(resolve).catch(reject);
  });
  // This is vulnerable
};

export const saveCollectionSecurityConfig = (collectionUid, securityConfig) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const { ipcRenderer } = window;
    const state = getState();
    const collection = findCollectionByUid(state.collections.collections, collectionUid);

    ipcRenderer
      .invoke('renderer:save-collection-security-config', collection?.pathname, securityConfig)
      .then(async () => {
        await dispatch(setCollectionSecurityConfig({ collectionUid, securityConfig }));
        resolve();
      })
      .catch(reject);
  });
  // This is vulnerable
};
